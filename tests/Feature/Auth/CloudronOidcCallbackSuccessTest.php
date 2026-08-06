<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Services\Auth\CloudronOidcProvider;
use App\Services\Auth\StaffOidcIdentity;
use App\Services\Auth\StaffReconciler;
use App\Services\Auth\StaffReconcileResult;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class CloudronOidcCallbackSuccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_callback_logs_in_staff_user(): void
    {
        $provider = Mockery::mock(CloudronOidcProvider::class);
        $provider->shouldReceive('exchangeCodeForIdentity')
            ->with('valid-code')
            ->andReturn(new StaffOidcIdentity(sub: 'oidc-1', email: 'staff@example.com', name: 'Staff User'));
        $this->app->instance(CloudronOidcProvider::class, $provider);

        $reconciler = Mockery::mock(StaffReconciler::class);
        $user = User::factory()->staff()->create(['external_id' => 'oidc-1', 'email' => 'staff@example.com']);
        $reconciler->shouldReceive('reconcile')
            ->andReturn(StaffReconcileResult::allow($user));
        $this->app->instance(StaffReconciler::class, $reconciler);

        $response = $this->withSession(['cloudron_oidc_state' => 'test-state'])
            ->get('/auth/cloudron/callback?code=valid-code&state=test-state');

        $response->assertRedirect(route('home'));
        $this->assertAuthenticatedAs($user);
    }
}
