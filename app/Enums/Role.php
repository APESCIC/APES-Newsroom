<?php

namespace App\Enums;

enum Role: string
{
    case Public = 'public';
    case Staff = 'staff';
    case Admin = 'admin';
    case SuperAdmin = 'super_admin';

    /**
     * Ordinal rank used for privilege comparisons. Higher is more privileged.
     */
    public function rank(): int
    {
        return match ($this) {
            self::Public => 0,
            self::Staff => 1,
            self::Admin => 2,
            self::SuperAdmin => 3,
        };
    }

    public function atLeast(self $other): bool
    {
        return $this->rank() >= $other->rank();
    }
}
