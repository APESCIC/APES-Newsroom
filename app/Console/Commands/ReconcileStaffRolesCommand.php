<?php

namespace App\Console\Commands;

use App\Enums\Role;
use App\Exceptions\Auth\LdapUnreachableException;
use App\Models\User;
use App\Services\Auth\LdapGroupLookup;
use Illuminate\Console\Command;

/**
 * Scheduled safety reconciliation for Cloudron staff accounts (issue #4).
 *
 * Re-queries LDAP group membership for every staff user and downgrades
 * or demotes accounts whose directory membership no longer matches.
 */
class ReconcileStaffRolesCommand extends Command
{
    protected $signature = 'staff:reconcile-roles';

    protected $description = 'Reconcile Cloudron staff roles from current LDAP group membership';

    public function handle(LdapGroupLookup $ldap): int
    {
        $staffUsers = User::query()
            ->where('auth_provider', 'cloudron_oidc')
            ->whereNotNull('external_id')
            ->get();

        $map = collect(config('rbac.ldap_group_map', []))
            ->mapWithKeys(fn (Role $role, string $group) => [mb_strtolower($group) => $role]);

        $updated = 0;
        $demoted = 0;

        foreach ($staffUsers as $user) {
            try {
                $groups = $ldap->groupsForEmail($user->email);
            } catch (LdapUnreachableException $e) {
                $this->warn("LDAP unreachable; skipping {$user->email}");

                continue;
            }

            $matchedRoles = collect($groups)
                ->flatMap(function (string $group) use ($map) {
                    $keys = [mb_strtolower($group)];
                    if (preg_match('/(^|,)cn=([^,]+)/i', $group, $matches) === 1) {
                        $keys[] = mb_strtolower($matches[2]);
                    }

                    return collect($keys)->map(fn (string $key) => $map->get($key));
                })
                ->filter()
                ->unique()
                ->values();

            if ($matchedRoles->isEmpty()) {
                $user->forceFill([
                    'role' => Role::Public,
                    'ldap_group_snapshot' => $groups,
                ])->save();

                $demoted++;
                $this->line("Demoted {$user->email} — no recognised LDAP groups");

                continue;
            }

            $role = $matchedRoles->sortByDesc(fn (Role $role) => $role->rank())->first();

            if ($user->role !== $role || $user->ldap_group_snapshot !== $groups) {
                $user->forceFill([
                    'role' => $role,
                    'ldap_group_snapshot' => $groups,
                ])->save();

                $updated++;
                $this->line("Updated {$user->email} → {$role->value}");
            }
        }

        $this->info("Reconciliation complete: {$updated} updated, {$demoted} demoted.");

        return self::SUCCESS;
    }
}
