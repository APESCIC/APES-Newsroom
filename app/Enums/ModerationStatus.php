<?php

namespace App\Enums;

enum ModerationStatus: string
{
    case Private = 'private';
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Suspended = 'suspended';

    public function isPubliclyVisible(): bool
    {
        return $this === self::Approved;
    }
}
