<?php

namespace App\Services\Auth;

use App\Exceptions\Auth\LdapUnreachableException;
use LdapRecord\Container;
use Throwable;

/**
 * Looks up the LDAP group DNs a staff member belongs to.
 *
 * This is a thin, mockable wrapper around LdapRecord so StaffReconciler's
 * fail-closed logic can be unit-tested without a real directory (via a
 * test double implementing this same interface, or LdapRecord's
 * DirectoryEmulator bound to the 'default' connection).
 */
class LdapGroupLookup
{
    /**
     * Return the DNs of every group under the configured groups base DN
     * that lists the given member DN.
     *
     * @return array<int, string>
     *
     * @throws LdapUnreachableException when the directory cannot be reached or searched.
     */
    public function groupsForMember(string $memberDn): array
    {
        $baseDn = config('services.cloudron_oidc.ldap_groups_base_dn');

        if (! $baseDn) {
            throw new LdapUnreachableException('LDAP groups base DN is not configured.');
        }

        try {
            $results = Container::getConnection('default')
                ->query()
                ->in($baseDn)
                ->where('member', '=', $memberDn)
                ->get();
        } catch (Throwable $e) {
            throw new LdapUnreachableException('Unable to query LDAP for group membership: '.$e->getMessage(), previous: $e);
        }

        return array_map(
            fn (array $entry) => is_array($entry['dn'] ?? null) ? $entry['dn'][0] : $entry['dn'],
            $results,
        );
    }
}
