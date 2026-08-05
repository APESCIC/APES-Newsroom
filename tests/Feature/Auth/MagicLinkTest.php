<?php

namespace Tests\Feature\Auth;

use App\Models\MagicLinkToken;
use App\Models\User;
use App\Notifications\MagicLinkNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class MagicLinkTest extends TestCase
{
    use RefreshDatabase;

    public function test_requesting_a_link_for_an_unknown_email_still_returns_ok(): void
    {
        $response = $this->post('/login/magic-link', ['email' => 'nobody@example.com']);

        $response->assertOk();
        $this->assertSame(0, MagicLinkToken::count());
    }

    public function test_a_valid_unexpired_unused_token_logs_the_user_in(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $this->post('/login/magic-link', ['email' => $user->email]);

        $signedUrl = null;
        Notification::assertSentTo($user, MagicLinkNotification::class, function (MagicLinkNotification $notification) use (&$signedUrl) {
            $signedUrl = (fn () => $this->url)->call($notification);

            return true;
        });

        $response = $this->get($signedUrl);

        $response->assertRedirect(route('home'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_an_expired_token_is_rejected(): void
    {
        $user = User::factory()->create();
        $signedUrl = $this->createTokenAndSignedUrl($user, now()->subMinute());

        $response = $this->get($signedUrl);

        $response->assertForbidden();
        $this->assertGuest();
    }

    public function test_a_used_token_cannot_be_replayed(): void
    {
        $user = User::factory()->create();
        $signedUrl = $this->createTokenAndSignedUrl($user, now()->addMinutes(15));

        $first = $this->get($signedUrl);
        $first->assertRedirect(route('home'));

        $this->post('/logout');

        $second = $this->get($signedUrl);
        $second->assertForbidden();
    }

    public function test_a_tampered_signature_is_rejected(): void
    {
        $user = User::factory()->create();
        $signedUrl = $this->createTokenAndSignedUrl($user, now()->addMinutes(15));

        $response = $this->get($signedUrl.'&tampered=1');

        $response->assertForbidden();
        $this->assertGuest();
    }

    private function createTokenAndSignedUrl(User $user, \DateTimeInterface $expiresAt): string
    {
        $rawToken = str()->random(64);

        $user->magicLinkTokens()->create([
            'token_hash' => hash('sha256', $rawToken),
            'expires_at' => $expiresAt,
        ]);

        return URL::temporarySignedRoute('magic-link.consume', now()->addMinutes(15), ['token' => $rawToken]);
    }
}
