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
            $groups = $this->ldap->groupsForEmail($identity->email);
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

        $user = User::query()
            ->where('external_id', $identity->sub)
            ->orWhere(function ($query) use ($identity): void {
                $query->where('email', $identity->email)
                    ->where('auth_provider', 'cloudron_oidc');
            })
            ->first() ?? new User;

        $user->forceFill([
            'external_id' => $identity->sub,
            'name' => $identity->name,
            'email' => $identity->email,
            'email_verified_at' => now(),
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
            ->mapWithKeys(fn (Role $role, string $key) => [mb_strtolower($key) => $role]);

        return collect($groups)
            ->flatMap(fn (string $group) => $this->groupLookupKeys($group))
            ->map(fn (string $key) => $map->get($key))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Build case-insensitive lookup keys for a memberof value.
     *
     * Cloudron returns full DNs (`cn=newsroom.staff,ou=groups,dc=cloudron`);
     * local OpenLDAP tests often pass bare CNs. Match both the raw value
     * and the CN RDN when present.
     *
     * @return array<int, string>
     */
    private function groupLookupKeys(string $group): array
    {
        $normalized = mb_strtolower($group);
        $keys = [$normalized];

        if (preg_match('/(^|,)cn=([^,]+)/i', $group, $matches) === 1) {
            $keys[] = mb_strtolower($matches[2]);
        }

        return array_values(array_unique($keys));
    }
}
