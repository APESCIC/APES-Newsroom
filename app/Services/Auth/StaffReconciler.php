<?php

namespace App\Services\Auth;

use App\Enums\Role;
use App\Exceptions\Auth\LdapUnreachableException;
use App\Models\User;

/**
 * Reconciles a Cloudron OIDC identity into a local staff User record,
 * deriving the user's Role from their LDAP group membership.
 *
 * Fail-closed by design: any failure or ambiguity in the LDAP lookup
 * denies the login outright rather than granting or preserving an
 * elevated role. See docs/epic-1-build-plan.md issue #4.
 */
class StaffReconciler
{
    public function __construct(private readonly LdapGroupLookup $ldap) {}

    public function reconcile(StaffOidcIdentity $identity): StaffReconcileResult
    {
        try {
            $groups = $this->ldap->groupsForMember($identity->sub);
        } catch (LdapUnreachableException) {
            return StaffReconcileResult::deny(
                'Staff sign-in failed: directory is currently unreachable. Please try again shortly.'
            );
        }

        $matchedRoles = $this->matchRoles($groups);

        if ($matchedRoles === []) {
            return StaffReconcileResult::deny(
                'Staff sign-in failed: your account is not a member of any recognised staff group.'
            );
        }

        $role = collect($matchedRoles)->sortByDesc(fn (Role $role) => $role->rank())->first();

        $user = User::firstOrNew(['external_id' => $identity->sub]);

        $user->forceFill([
            'name' => $identity->name,
            'email' => $identity->email,
            'password' => null,
            'auth_provider' => 'cloudron_oidc',
            'role' => $role,
            'ldap_group_snapshot' => $groups,
        ])->save();

        return StaffReconcileResult::allow($user);
    }

    /**
     * @param  array<int, string>  $groups
     * @return array<int, Role>
     */
    private function matchRoles(array $groups): array
    {
        $map = collect(config('rbac.ldap_group_map', []))
            ->mapWithKeys(fn (Role $role, string $dn) => [mb_strtolower($dn) => $role]);

        return collect($groups)
            ->map(fn (string $group) => $map->get(mb_strtolower($group)))
            ->filter()
            ->values()
            ->all();
    }
}
