<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class LoginPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_hides_staff_sign_in_when_oidc_is_not_configured(): void
    {
        config(['services.cloudron_oidc.discovery_url' => null]);

        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Auth/Login')
                ->where('staffLoginUrl', null)
            );
    }

    public function test_login_page_shows_staff_sign_in_when_oidc_is_configured(): void
    {
        config(['services.cloudron_oidc.discovery_url' => 'https://cloudron.example/.well-known/openid-configuration']);

        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Auth/Login')
                ->where('staffLoginUrl', route('cloudron.redirect'))
            );
    }
}
