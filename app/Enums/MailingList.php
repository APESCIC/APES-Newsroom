<?php

namespace App\Enums;

enum MailingList: string
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

    public function purpose(): string
    {
        return match ($this) {
            self::ApesCic => 'News and updates from APES CIC about our charity work and campaigns.',
            self::ApesShelterRescue => 'Updates from APES Shelter & Rescue about animals in our care and adoption news.',
            self::ApesPetCareClinic => 'News from APES Pet Care Clinic about clinics, care advice, and services.',
        };
    }
}
