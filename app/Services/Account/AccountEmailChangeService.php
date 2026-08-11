<?php

namespace App\Services\Account;

use App\Enums\ConsentAction;
use App\Enums\MailingList;
use App\Enums\SubscriptionStatus;
use App\Models\ConsentEvent;
use App\Models\MailingContact;
use App\Models\MailingListSubscription;
use App\Models\Suppression;
use App\Models\User;
use App\Notifications\ConfirmMailingListNotification;
use App\Services\Mailing\ConsentService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AccountEmailChangeService
{
    /**
     * @param  array{name: string, email: string}  $attributes
     */
    public function update(User $user, array $attributes, ?string $ip = null, ?string $userAgent = null): User
    {
        return DB::transaction(function () use ($user, $attributes, $ip, $userAgent) {
            $lockedUser = User::query()->lockForUpdate()->findOrFail($user->id);
            $oldEmail = $this->normalizeEmail($lockedUser->email);
            $newEmail = $this->normalizeEmail($attributes['email']);

            if ($oldEmail === $newEmail) {
                $lockedUser->update(['name' => $attributes['name']]);

                return $lockedUser->fresh();
            }

            $oldContact = MailingContact::query()
                ->where('email', $oldEmail)
                ->lockForUpdate()
                ->first();
            $oldSuppressed = Suppression::query()
                ->where('email', $oldEmail)
                ->lockForUpdate()
                ->exists();
            $activeLists = [];

            if ($oldContact) {
                $subscriptions = $oldContact->subscriptions()->lockForUpdate()->get();

                foreach ($subscriptions as $subscription) {
                    if (! in_array($subscription->status, [SubscriptionStatus::Confirmed, SubscriptionStatus::Pending], true)) {
                        continue;
                    }

                    if (! $oldSuppressed) {
                        $activeLists[$subscription->list->value] = $subscription->list;
                    }

                    $subscription->update([
                        'status' => SubscriptionStatus::Unsubscribed,
                        'confirm_token' => null,
                        'unsubscribed_at' => now(),
                    ]);

                    $this->recordEvent(
                        $oldContact,
                        $subscription->list,
                        ConsentAction::Unsubscribed,
                        ['account_email_changed_to' => $newEmail],
                        $ip,
                        $userAgent,
                    );
                }

                Suppression::query()->firstOrCreate(
                    ['email' => $oldEmail],
                    ['reason' => 'account_email_change'],
                );
                $this->recordEvent(
                    $oldContact,
                    null,
                    ConsentAction::Suppressed,
                    ['reason' => 'account_email_change'],
                    $ip,
                    $userAgent,
                );
                $oldContact->update(['user_id' => null]);
            }

            $lockedUser->forceFill([
                'name' => $attributes['name'],
                'email' => $newEmail,
                'email_verified_at' => null,
            ])->save();

            $confirmations = [];

            if ($oldContact) {
                $newContact = MailingContact::query()
                    ->where('email', $newEmail)
                    ->lockForUpdate()
                    ->first();

                if (! $newContact) {
                    $newContact = MailingContact::query()->create([
                        'email' => $newEmail,
                        'user_id' => $lockedUser->id,
                    ]);
                } elseif ($newContact->user_id !== $lockedUser->id) {
                    $newContact->update(['user_id' => $lockedUser->id]);
                }

                $newSuppressed = Suppression::query()
                    ->where('email', $newEmail)
                    ->lockForUpdate()
                    ->exists();

                if (! $newSuppressed) {
                    foreach ($activeLists as $list) {
                        $subscription = MailingListSubscription::query()
                            ->where('mailing_contact_id', $newContact->id)
                            ->where('list', $list->value)
                            ->lockForUpdate()
                            ->first();

                        if ($subscription?->status === SubscriptionStatus::Unsubscribed) {
                            continue;
                        }

                        $token = Str::random(64);
                        $subscription ??= new MailingListSubscription([
                            'mailing_contact_id' => $newContact->id,
                            'list' => $list,
                        ]);
                        $subscription->fill([
                            'status' => SubscriptionStatus::Pending,
                            'confirm_token' => $token,
                            'confirmed_at' => null,
                            'unsubscribed_at' => null,
                        ])->save();

                        $this->recordEvent(
                            $newContact,
                            $list,
                            ConsentAction::SignupRequested,
                            ['confirm_token_issued' => true, 'account_email_changed_from' => $oldEmail],
                            $ip,
                            $userAgent,
                        );
                        $confirmations[] = [$newContact->id, $list, $token];
                    }
                }
            }

            $userId = $lockedUser->id;
            DB::afterCommit(function () use ($userId, $confirmations) {
                $updatedUser = User::query()->find($userId);
                $updatedUser?->sendEmailVerificationNotification();

                foreach ($confirmations as [$contactId, $list, $token]) {
                    $contact = MailingContact::query()->find($contactId);
                    $contact?->notify(new ConfirmMailingListNotification(
                        $list,
                        url('/mailing/confirm/'.$token),
                    ));
                }
            });

            return $lockedUser->fresh();
        });
    }

    /**
     * @param  array<string, mixed>  $evidence
     */
    private function recordEvent(
        MailingContact $contact,
        ?MailingList $list,
        ConsentAction $action,
        array $evidence,
        ?string $ip,
        ?string $userAgent,
    ): void {
        ConsentEvent::query()->create([
            'mailing_contact_id' => $contact->id,
            'email' => $contact->email,
            'list' => $list,
            'action' => $action,
            'source' => 'account_email_change',
            'wording_version' => ConsentService::WORDING_VERSION,
            'evidence' => $evidence,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'created_at' => now(),
        ]);
    }

    private function normalizeEmail(string $email): string
    {
        return Str::lower(trim($email));
    }
}
