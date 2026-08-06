<?php

namespace App\Http\Controllers\Mailing;

use App\Http\Controllers\Controller;
use App\Services\Mailing\ConsentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmController extends Controller
{
    public function __construct(private readonly ConsentService $consent) {}

    public function __invoke(Request $request, string $token): Response|RedirectResponse
    {
        $subscription = $this->consent->confirm(
            $token,
            $request->ip(),
            $request->userAgent(),
        );

        return Inertia::render('Mailing/Confirmed', [
            'list' => $subscription->list->label(),
        ]);
    }
}
