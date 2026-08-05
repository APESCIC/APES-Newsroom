<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CloudronOidcControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_callback_is_denied_when_state_does_not_match(): void
    {
        $this->withSession(['cloudron_oidc_state' => 'expected-state']);

        $response = $this->get('/auth/cloudron/callback?state=wrong-state&code=abc');

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_callback_is_denied_when_no_state_was_stored(): void
    {
        $response = $this->get('/auth/cloudron/callback?state=whatever&code=abc');

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_callback_is_denied_when_no_authorization_code_is_returned(): void
    {
        $this->withSession(['cloudron_oidc_state' => 'expected-state']);

        $response = $this->get('/auth/cloudron/callback?state=expected-state');

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }
}
