<?php

namespace App\Services\Mailing;

use App\Enums\CampaignRecipientStatus;
use App\Enums\CampaignStatus;
use App\Enums\MailingList;
use App\Jobs\SendCampaignRecipientJob;
use App\Models\Campaign;
use App\Models\CampaignRecipient;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CampaignService
{
    public function __construct(private readonly ConsentService $consent) {}

    /**
     * Create an immutable live campaign from a published post when email_on_publish is set.
     * Idempotent: returns existing live campaign if one already exists for the post.
     */
    public function createFromPublishedPost(Post $post, User $actor): ?Campaign
    {
        if (! $post->email_on_publish) {
            return null;
        }

        $lists = $this->normalizeListValues($post->mailing_lists ?? []);
        if ($lists === []) {
            return null;
        }

        $existing = Campaign::query()
            ->where('post_id', $post->id)
            ->where('is_test', false)
            ->first();

        if ($existing) {
            return $existing;
        }

        return DB::transaction(function () use ($post, $actor, $lists) {
            $campaign = Campaign::create([
                'post_id' => $post->id,
                'created_by' => $actor->id,
                'lists' => $lists,
                'snapshot' => $this->buildSnapshot($post),
                'status' => CampaignStatus::Queued,
                'is_test' => false,
                'queued_at' => now(),
            ]);

            $emails = $this->consent->confirmedEmailsForLists($lists);

            foreach ($emails as $email) {
                $this->createRecipient($campaign, $email);
            }

            $this->dispatchRecipients($campaign);

            return $campaign->fresh(['recipients']);
        });
    }

    public function createTestSend(Post $post, User $actor, string $recipientEmail): Campaign
    {
        $lists = $this->normalizeListValues($post->mailing_lists ?? []);
        if ($lists === []) {
            $lists = [MailingList::ApesCic->value];
        }

        $email = Str::lower(trim($recipientEmail));

        return DB::transaction(function () use ($post, $actor, $lists, $email) {
            $campaign = Campaign::create([
                'post_id' => $post->id,
                'created_by' => $actor->id,
                'lists' => $lists,
                'snapshot' => $this->buildSnapshot($post),
                'status' => CampaignStatus::Queued,
                'is_test' => true,
                'test_recipient' => $email,
                'queued_at' => now(),
            ]);

            $recipient = $this->createRecipient($campaign, $email);
            SendCampaignRecipientJob::dispatch($recipient->id)->onQueue('mail-test');

            return $campaign->fresh(['recipients']);
        });
    }

    /**
     * @return array<string, mixed>
     */
    public function buildSnapshot(Post $post): array
    {
        $post->loadMissing('author');

        return [
            'title' => $post->title,
            'excerpt' => $post->excerpt,
            'hero_image' => $post->hero_image,
            'hero_image_alt' => $post->hero_image_alt,
            'author' => $post->author->name,
            'channel' => $post->channel->value,
            'channel_label' => $post->channel->label(),
            'published_at' => $post->published_at?->toIso8601String(),
            'read_more_url' => url('/articles/'.$post->slug),
            'slug' => $post->slug,
        ];
    }

    public function previewPayload(Post $post): array
    {
        return $this->buildSnapshot($post);
    }

    private function createRecipient(Campaign $campaign, string $email): CampaignRecipient
    {
        return CampaignRecipient::create([
            'campaign_id' => $campaign->id,
            'email' => $email,
            'status' => CampaignRecipientStatus::Queued,
            'idempotency_key' => hash('sha256', $campaign->id.'|'.$email),
            'attempts' => 0,
        ]);
    }

    private function dispatchRecipients(Campaign $campaign): void
    {
        $delaySeconds = 0;
        $perMinute = (int) config('mailing.throttle_per_minute', 60);
        $interval = $perMinute > 0 ? (int) ceil(60 / $perMinute) : 1;

        $campaign->recipients()
            ->where('status', CampaignRecipientStatus::Queued)
            ->orderBy('id')
            ->each(function (CampaignRecipient $recipient) use (&$delaySeconds, $interval) {
                SendCampaignRecipientJob::dispatch($recipient->id)
                    ->delay(now()->addSeconds($delaySeconds));
                $delaySeconds += $interval;
            });

        $campaign->update(['status' => CampaignStatus::Sending]);
    }

    /**
     * @param  list<string>  $lists
     * @return list<string>
     */
    private function normalizeListValues(array $lists): array
    {
        $out = [];
        foreach ($lists as $list) {
            $enum = MailingList::tryFrom((string) $list);
            if ($enum) {
                $out[$enum->value] = $enum->value;
            }
        }

        return array_values($out);
    }
}
