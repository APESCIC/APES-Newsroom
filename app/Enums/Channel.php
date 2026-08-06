<?php

namespace App\Enums;

enum Channel: string
{
    case ApesCic = 'apes_cic';
    case ApesShelterRescue = 'apes_shelter_rescue';
    case ApesPetCareClinic = 'apes_pet_care_clinic';

    public function label(): string
    {
        return match ($this) {
            self::ApesCic => 'APES CIC',
            self::ApesShelterRescue => 'APES Shelter & Rescue',
            self::ApesPetCareClinic => 'APES Pet Care Clinic',
        };
    }

    public function slug(): string
    {
        return match ($this) {
            self::ApesCic => 'apes-cic',
            self::ApesShelterRescue => 'apes-shelter-rescue',
            self::ApesPetCareClinic => 'apes-pet-care-clinic',
        };
    }

    public static function fromSlug(string $slug): ?self
    {
        return collect(self::cases())->first(fn (self $c) => $c->slug() === $slug);
    }
}
