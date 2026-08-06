<?php

namespace Tests\Feature\Auth;

use App\Services\Auth\LdapGroupLookup;
use LdapRecord\Laravel\Testing\DirectoryEmulator;
use LdapRecord\Models\Entry;
use Tests\TestCase;

class LdapGroupLookupTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        DirectoryEmulator::setup('default');

        config([
            'ldap.connections.default.base_dn' => 'dc=apes,dc=local',
            'services.cloudron_ldap.users_base_dn' => 'ou=users,dc=apes,dc=local',
        ]);
    }

    public function test_returns_memberof_groups_for_a_matching_user_email(): void
    {
        $groupDn = 'cn=newsroom-staff,ou=groups,dc=apes,dc=local';

        Entry::create([
            'dn' => $groupDn,
            'objectclass' => ['groupOfNames'],
            'cn' => 'newsroom-staff',
        ]);

        Entry::create([
            'dn' => 'cn=staffer,ou=users,dc=apes,dc=local',
            'objectclass' => ['inetOrgPerson'],
            'cn' => 'Staffer Person',
            'uid' => 'staffer',
            'mail' => 'staffer@example.com',
            'memberof' => [$groupDn],
        ]);

        $groups = (new LdapGroupLookup)->groupsForEmail('staffer@example.com');

        $this->assertSame([$groupDn], $groups);
    }

    public function test_returns_empty_array_when_no_user_matches_the_email(): void
    {
        $groups = (new LdapGroupLookup)->groupsForEmail('nobody@example.com');

        $this->assertSame([], $groups);
    }
}
