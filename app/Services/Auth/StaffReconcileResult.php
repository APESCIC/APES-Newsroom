<?php

namespace App\Services\Auth;

use App\Models\User;

final readonly class StaffReconcileResult
{
    private function __construct(
        public bool $allowed,
        public ?User $user = null,
        public ?string $denialReason = null,
    ) {}

    public static function allow(User $user): self
    {
        return new self(true, $user);
    }

    public static function deny(string $reason): self
    {
        return new self(false, null, $reason);
    }
}
