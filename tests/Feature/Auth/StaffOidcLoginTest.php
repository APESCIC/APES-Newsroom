<?php

namespace Tests\Feature\Auth;

use App\Enums\Role;
use App\Exceptions\Auth\LdapUnreachableException;
use App\Models\User;
use App\Services\Auth\LdapGroupLookup;
use App\Services\Auth\StaffOidcIdentity;
use App\Services\Auth\StaffReconciler;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class StaffOidcLoginTest extends TestCase
{
    use RefreshDatabase;

    private const STAFF_GROUP = 'newsroom-staff';

    private const ADMIN_GROUP = 'newsroom-admins';

    private const SUPER_ADMIN_GROUP = 'newsroom-super-admins';

    private function identity(string $sub = 'oidc-sub-1'): StaffOidcIdentity
    {
        return new StaffOidcIdentity(sub: $sub, email: 'staffer@example.com', name: 'Staffer Person');
    }

    private function reconcilerWithGroups(array $groups): StaffReconciler
    {
        $lookup = Mockery::mock(LdapGroupLookup::class);
        $lookup->shouldReceive('groupsForEmail')->andReturn($groups);

        return new StaffReconciler($lookup);
    }

    private function reconcilerThatFails(): StaffReconciler
    {
        $lookup = Mockery::mock(LdapGroupLookup::class);
        $lookup->shouldReceive('groupsForEmail')->andThrow(new LdapUnreachableException('down'));

        return new StaffReconciler($lookup);
    }

    public function test_a_single_recognised_group_grants_staff(): void
    {
        $result = $this->reconcilerWithGroups([self::STAFF_GROUP])->reconcile($this->identity());

        $this->assertTrue($result->allowed);
        $this->assertSame(Role::Staff, $result->user->role);
        $this->assertSame('cloudron_oidc', $result->user->auth_provider);
        $this->assertNull($result->user->password);
    }

    public function test_an_admin_group_grants_admin(): void
    {
        $result = $this->reconcilerWithGroups([self::ADMIN_GROUP])->reconcile($this->identity());

        $this->assertTrue($result->allowed);
        $this->assertSame(Role::Admin, $result->user->role);
    }

    public function test_a_super_admin_group_grants_super_admin(): void
    {
        $result = $this->reconcilerWithGroups([self::SUPER_ADMIN_GROUP])->reconcile($this->identity());

        $this->assertTrue($result->allowed);
        $this->assertSame(Role::SuperAdmin, $result->user->role);
    }

    public function test_membership_in_multiple_groups_grants_the_highest_matched_role(): void
    {
        $result = $this->reconcilerWithGroups([self::STAFF_GROUP, self::ADMIN_GROUP])->reconcile($this->identity());

        $this->assertTrue($result->allowed);
        $this->assertSame(Role::Admin, $result->user->role);
    }

    public function test_login_is_denied_when_ldap_is_unreachable(): void
    {
        $result = $this->reconcilerThatFails()->reconcile($this->identity());

        $this->assertFalse($result->allowed);
        $this->assertNull($result->user);
        $this->assertNotNull($result->denialReason);
        $this->assertSame(0, User::count());
    }

    public function test_login_is_denied_when_ldap_is_unreachable_and_does_not_touch_an_existing_users_role(): void
    {
        $existing = User::factory()->admin()->create(['external_id' => 'oidc-sub-1']);

        $this->reconcilerThatFails()->reconcile($this->identity());

        $existing->refresh();
        $this->assertSame(Role::Admin, $existing->role);
    }

    public function test_login_is_denied_when_the_user_has_no_recognised_group(): void
    {
        $result = $this->reconcilerWithGroups(['cn=some-unrelated-group,dc=apes,dc=org,dc=uk'])->reconcile($this->identity());

        $this->assertFalse($result->allowed);
        $this->assertSame(0, User::count());
    }

    public function test_login_is_denied_when_the_user_belongs_to_no_groups_at_all(): void
    {
        $result = $this->reconcilerWithGroups([])->reconcile($this->identity());

        $this->assertFalse($result->allowed);
    }

    public function test_reauthenticating_into_only_a_lower_group_downgrades_the_stored_role(): void
    {
        $existing = User::factory()->admin()->create(['external_id' => 'oidc-sub-1']);
        $this->assertSame(Role::Admin, $existing->role);

        $result = $this->reconcilerWithGroups([self::STAFF_GROUP])->reconcile($this->identity('oidc-sub-1'));

        $this->assertTrue($result->allowed);
        $this->assertSame($existing->id, $result->user->id);
        $this->assertSame(Role::Staff, $result->user->fresh()->role);
    }

    public function test_a_staff_account_never_has_a_local_password_after_reconciliation(): void
    {
        $result = $this->reconcilerWithGroups([self::STAFF_GROUP])->reconcile($this->identity());

        $this->assertNull($result->user->password);
    }
}
