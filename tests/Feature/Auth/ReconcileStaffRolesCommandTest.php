<?php

namespace Tests\Feature\Auth;

use App\Enums\Role;
use App\Models\User;
use App\Services\Auth\LdapGroupLookup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class ReconcileStaffRolesCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_demotes_staff_without_recognised_groups(): void
    {
        $user = User::factory()->admin()->create(['email' => 'staffer@example.com']);

        $lookup = Mockery::mock(LdapGroupLookup::class);
        $lookup->shouldReceive('groupsForEmail')->with('staffer@example.com')->andReturn([]);
        $this->app->instance(LdapGroupLookup::class, $lookup);

        $this->artisan('staff:reconcile-roles')->assertSuccessful();

        $this->assertSame(Role::Public, $user->fresh()->role);
    }

    public function test_command_updates_role_when_ldap_membership_changes(): void
    {
        $user = User::factory()->staff()->create(['email' => 'staffer@example.com']);

        $lookup = Mockery::mock(LdapGroupLookup::class);
        $lookup->shouldReceive('groupsForEmail')->with('staffer@example.com')->andReturn(['newsroom-admins']);
        $this->app->instance(LdapGroupLookup::class, $lookup);

        $this->artisan('staff:reconcile-roles')->assertSuccessful();

        $this->assertSame(Role::Admin, $user->fresh()->role);
    }
}
