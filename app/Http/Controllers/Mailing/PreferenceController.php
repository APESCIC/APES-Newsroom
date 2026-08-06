<?php

namespace App\Http\Controllers\Mailing;

use App\Enums\MailingList;
use App\Http\Controllers\Controller;
use App\Services\Mailing\ConsentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PreferenceController extends Controller
{
    public function __construct(private readonly ConsentService $consent) {}

    public function showSigned(Request $request): Response
    {
        abort_unless($request->hasValidSignature(), 403);

        $email = strtolower((string) $request->query('email'));

        return Inertia::render('Mailing/Preferences', [
            'email' => $email,
            'lists' => array_values($this->consent->preferenceStateForEmail($email)),
            'signed' => true,
        ]);
    }

    public function showAccount(Request $request): Response
    {
        $email = strtolower($request->user()->email);

        return Inertia::render('Mailing/Preferences', [
            'email' => $email,
            'lists' => array_values($this->consent->preferenceStateForEmail($email)),
            'signed' => false,
        ]);
    }

    public function updateSigned(Request $request): RedirectResponse
    {
        abort_unless($request->hasValidSignature(), 403);

        $email = strtolower((string) $request->query('email'));
        $validated = $request->validate([
            'lists' => ['array'],
            'lists.*' => [Rule::enum(MailingList::class)],
        ]);

        $selected = $validated['lists'] ?? [];
        $current = $this->consent->preferenceStateForEmail($email);

        foreach (MailingList::cases() as $list) {
            $wants = in_array($list->value, $selected, true);
            $status = $current[$list->value]['status'] ?? null;

            if ($wants && $status !== 'confirmed' && $status !== 'pending') {
                $this->consent->signup(
                    email: $email,
                    lists: [$list->value],
                    source: 'signed_preferences',
                    ip: $request->ip(),
                    userAgent: $request->userAgent(),
                );
            } elseif (! $wants && in_array($status, ['confirmed', 'pending'], true)) {
                $this->consent->unsubscribe(
                    email: $email,
                    list: $list,
                    source: 'signed_preferences',
                    ip: $request->ip(),
                    userAgent: $request->userAgent(),
                );
            }
        }

        return back()->with('status', 'preferences-updated');
    }

    public function updateAccount(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lists' => ['array'],
            'lists.*' => [Rule::enum(MailingList::class)],
        ]);

        $this->consent->syncAccountPreferences(
            $request->user(),
            $validated['lists'] ?? [],
            $request->ip(),
            $request->userAgent(),
        );

        return back()->with('status', 'preferences-updated');
    }
}
