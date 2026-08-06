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

class SignupController extends Controller
{
    public function __construct(private readonly ConsentService $consent) {}

    public function show(): Response
    {
        return Inertia::render('Mailing/Signup', [
            'lists' => $this->listOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'lists' => ['required', 'array', 'min:1'],
            'lists.*' => [Rule::enum(MailingList::class)],
        ]);

        $this->consent->signup(
            email: $validated['email'],
            lists: $validated['lists'],
            source: 'public_signup',
            user: $request->user(),
            ip: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return back()->with('status', 'check-email');
    }

    /**
     * @return list<array{value: string, label: string, purpose: string}>
     */
    private function listOptions(): array
    {
        return collect(MailingList::cases())->map(fn (MailingList $list) => [
            'value' => $list->value,
            'label' => $list->label(),
            'purpose' => $list->purpose(),
        ])->all();
    }
}
