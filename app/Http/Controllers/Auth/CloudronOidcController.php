<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\CloudronOidcProvider;
use App\Services\Auth\StaffReconciler;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CloudronOidcController extends Controller
{
    public function __construct(
        private readonly CloudronOidcProvider $provider,
        private readonly StaffReconciler $reconciler,
    ) {}

    public function redirect(Request $request): RedirectResponse
    {
        $authorizationUrl = $this->provider->authorizationUrl();

        $request->session()->put('cloudron_oidc_state', $this->provider->getState());

        return redirect()->away($authorizationUrl);
    }

    public function callback(Request $request): RedirectResponse
    {
        $expectedState = $request->session()->pull('cloudron_oidc_state');

        if (! $expectedState || $request->query('state') !== $expectedState) {
            return redirect()->route('login')->withErrors([
                'email' => 'Staff sign-in failed: invalid or expired authentication state.',
            ]);
        }

        $code = $request->query('code');

        if (! $code) {
            return redirect()->route('login')->withErrors([
                'email' => 'Staff sign-in failed: no authorization code returned.',
            ]);
        }

        $identity = $this->provider->exchangeCodeForIdentity($code);

        $result = $this->reconciler->reconcile($identity);

        if (! $result->allowed) {
            return redirect()->route('login')->withErrors([
                'email' => $result->denialReason ?? 'Staff sign-in failed: access denied.',
            ]);
        }

        auth()->login($result->user);

        $request->session()->regenerate();

        return redirect()->route('home');
    }
}
