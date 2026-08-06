<?php

namespace App\Enums;

enum ReactionType: string
{
    case Helpful = 'helpful';
    case Support = 'support';
    case ThankYou = 'thank_you';

    public function label(): string
    {
        return match ($this) {
            self::Helpful => 'Helpful',
            self::Support => 'Support',
            self::ThankYou => 'Thank You',
        };
    }
}
