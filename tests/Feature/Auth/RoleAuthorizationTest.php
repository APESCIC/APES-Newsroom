<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class RoleAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware(['web', 'auth', 'role:staff'])->get('/_test/staff-only', fn () => 'ok');
        Route::middleware(['web', 'auth', 'role:admin'])->get('/_test/admin-only', fn () => 'ok');
        Route::middleware(['web', 'auth', 'role:super_admin'])->get('/_test/super-admin-only', fn () => 'ok');
    }

    public function test_guest_is_redirected_to_login_from_any_protected_route(): void
    {
        $this->get('/_test/staff-only')->assertRedirect(route('login'));
    }

    public function test_public_user_cannot_access_staff_only_route(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/_test/staff-only')->assertForbidden();
    }

    public function test_staff_cannot_access_admin_only_route(): void
    {
        $user = User::factory()->staff()->create();

        $this->actingAs($user)->get('/_test/staff-only')->assertOk();
        $this->actingAs($user)->get('/_test/admin-only')->assertForbidden();
    }

    public function test_admin_can_access_admin_route_but_not_super_admin_route(): void
    {
        $user = User::factory()->admin()->create();

        $this->actingAs($user)->get('/_test/admin-only')->assertOk();
        $this->actingAs($user)->get('/_test/super-admin-only')->assertForbidden();
    }

    public function test_super_admin_can_access_everything_admin_can(): void
    {
        $user = User::factory()->superAdmin()->create();

        $this->actingAs($user)->get('/_test/staff-only')->assertOk();
        $this->actingAs($user)->get('/_test/admin-only')->assertOk();
        $this->actingAs($user)->get('/_test/super-admin-only')->assertOk();
    }
}
