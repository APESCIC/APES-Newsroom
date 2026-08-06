<?php

namespace App\Http\Controllers\Mailing;

use App\Enums\MailingList;
use App\Http\Controllers\Controller;
use App\Services\Mailing\ConsentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UnsubscribeController extends Controller
{
    public function __construct(private readonly ConsentService $consent) {}

    public function show(Request $request): \Inertia\Response
    {
        abort_unless($request->hasValidSignature(), 403);

        $email = strtolower((string) $request->query('email'));

        return Inertia::render('Mailing/Unsubscribe', [
            'email' => $email,
            'lists' => collect(MailingList::cases())->map(fn (MailingList $list) => [
                'value' => $list->value,
                'label' => $list->label(),
            ])->all(),
        ]);
    }

    public function store(Request $request): RedirectResponse|Response
    {
        abort_unless($request->hasValidSignature(), 403);

        $email = strtolower((string) $request->query('email'));

        $validated = $request->validate([
            'list' => ['nullable', Rule::enum(MailingList::class)],
            'all' => ['sometimes', 'boolean'],
        ]);

        $list = isset($validated['list'])
            ? MailingList::from($validated['list'])
            : null;

        if ($request->boolean('all') || $list === null) {
            $this->consent->unsubscribe(
                email: $email,
                list: null,
                source: 'unsubscribe_link',
                ip: $request->ip(),
                userAgent: $request->userAgent(),
            );
        } else {
            $this->consent->unsubscribe(
                email: $email,
                list: $list,
                source: 'unsubscribe_link',
                ip: $request->ip(),
                userAgent: $request->userAgent(),
            );
        }

        // RFC 8058 one-click unsubscribe may POST without a body expecting 200.
        if ($request->expectsJson() || $request->header('List-Unsubscribe') === 'One-Click') {
            return response()->noContent();
        }

        return redirect()->route('home')->with('status', 'unsubscribed');
    }

    /**
     * One-click POST endpoint (List-Unsubscribe-Post).
     */
    public function oneClick(Request $request): Response
    {
        abort_unless($request->hasValidSignature(), 403);

        $email = strtolower((string) $request->query('email'));

        $this->consent->unsubscribe(
            email: $email,
            list: null,
            source: 'list_unsubscribe_one_click',
            ip: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return response()->noContent();
    }
}
