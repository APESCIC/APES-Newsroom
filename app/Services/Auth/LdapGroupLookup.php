<?php

namespace App\Services\Auth;

use App\Exceptions\Auth\LdapUnreachableException;
use LdapRecord\Container;
use Throwable;

/**
 * Looks up the LDAP groups a staff member belongs to.
 *
 * Cloudron LDAP exposes group membership on the user entry via the
 * `memberof` attribute rather than a `member` filter on group entries.
 * This is a thin, mockable wrapper around LdapRecord so StaffReconciler's
 * fail-closed logic can be unit-tested without a real directory.
 */
class LdapGroupLookup
{
    /**
     * Return the group identifiers (CN or DN) for the user with the given email.
     *
     * @return array<int, string>
     *
     * @throws LdapUnreachableException when the directory cannot be reached or searched.
     */
    public function groupsForEmail(string $email): array
    {
        $usersBaseDn = config('services.cloudron_ldap.users_base_dn')
            ?? config('ldap.connections.default.base_dn');

        if (! $usersBaseDn) {
            throw new LdapUnreachableException('LDAP users base DN is not configured.');
        }

        try {
            $results = Container::getConnection('default')
                ->query()
                ->in($usersBaseDn)
                ->select(['*', 'memberOf'])
                ->where('mail', '=', $email)
                ->get();
        } catch (Throwable $e) {
            throw new LdapUnreachableException('Unable to query LDAP for group membership: '.$e->getMessage(), previous: $e);
        }

        if ($results === []) {
            return [];
        }

        $memberof = $results[0]['memberof'] ?? [];

        if (! is_array($memberof)) {
            return $memberof !== '' && $memberof !== null ? [(string) $memberof] : [];
        }

        // LdapRecord/php-ldap may include a numeric `count` entry alongside DNs.
        return array_values(array_filter(
            array_map('strval', $memberof),
            fn (string $value) => $value !== '' && ! ctype_digit($value),
        ));
    }
}
