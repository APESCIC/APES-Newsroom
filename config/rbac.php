<?php

use App\Enums\Role;

return [

    /*
    |--------------------------------------------------------------------
    | LDAP group to role mapping
    |--------------------------------------------------------------------
    |
    | Maps Cloudron LDAP group identifiers to application Role values.
    | Keys must match the values returned in each user's `memberof`
    | attribute exactly (case-insensitive) — run the ldapsearch command
    | in docs/deployment.md to discover the real group names after
    | creating groups in Cloudron.
    |
    | Cloudron may return either a group CN (e.g. `newsroom-staff`) or a
    | full DN — include whichever format your directory returns. Only
    | groups listed here are recognised. Any staff member whose groups do
    | not intersect this map is denied login (fail closed) — see
    | App\Services\Auth\StaffReconciler.
    |
    */
    'ldap_group_map' => [
        'newsroom-staff' => Role::Staff,
        'newsroom-admins' => Role::Admin,
        'newsroom-super-admins' => Role::SuperAdmin,
    ],

];
