<?php

use App\Enums\Role;

return [

    /*
    |--------------------------------------------------------------------
    | LDAP group to role mapping
    |--------------------------------------------------------------------
    |
    | Maps Cloudron LDAP group distinguished names (or CNs, depending on
    | what CLOUDRON_LDAP_GROUPS_BASE_DN search returns) to application
    | Role values. This is a best guess pending real Cloudron group names
    | (see docs/epic-1-build-plan.md issue #4) - expect a config-only
    | follow-up once the real directory is available, not a code change.
    |
    | Only groups listed here are recognised. Any staff member whose
    | groups do not intersect this map is denied login (fail closed) -
    | see App\Services\Auth\StaffReconciler.
    |
    */
    'ldap_group_map' => [
        'cn=newsroom-staff,ou=groups,dc=apes,dc=org,dc=uk' => Role::Staff,
        'cn=newsroom-admins,ou=groups,dc=apes,dc=org,dc=uk' => Role::Admin,
        'cn=newsroom-super-admins,ou=groups,dc=apes,dc=org,dc=uk' => Role::SuperAdmin,
    ],

];
