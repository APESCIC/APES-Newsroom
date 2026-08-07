import type { IconName } from './Components/Icons/LineIcon';

export type ChannelAccent = 'apes' | 'shelter' | 'clinic';

export type ChannelMeta = {
    label: string;
    description: string;
    accent: ChannelAccent;
    icon: IconName;
    textClass: string;
    borderClass: string;
    badgeClass: string;
    mediaClass: string;
};

export const channelMetaBySlug: Record<string, ChannelMeta> = {
    'apes-cic': {
        label: 'APES CIC',
        description: 'Mission stories from the field of global conservation.',
        accent: 'apes',
        icon: 'tree',
        textClass: 'text-apes-primary',
        borderClass: 'border-apes-primary',
        badgeClass: 'bg-apes-mist text-apes-primary',
        mediaClass: 'bg-apes-mist text-apes-primary',
    },
    'apes-shelter-rescue': {
        label: 'Shelter & Rescue',
        description: 'Updates on rescued animals and adoption successes.',
        accent: 'shelter',
        icon: 'shelter',
        textClass: 'text-shelter-text',
        borderClass: 'border-shelter-accent',
        badgeClass: 'bg-shelter-mist text-shelter-text',
        mediaClass: 'bg-shelter-mist text-shelter-accent',
    },
    'apes-pet-care-clinic': {
        label: 'Pet Care Clinic',
        description: 'Expert clinic notes and community health advice.',
        accent: 'clinic',
        icon: 'clinic',
        textClass: 'text-clinic-text',
        borderClass: 'border-clinic-accent',
        badgeClass: 'bg-clinic-mist text-clinic-text',
        mediaClass: 'bg-clinic-mist text-clinic-accent',
    },
};

const slugAliases: Record<string, string> = {
    apes: 'apes-cic',
    apes_cic: 'apes-cic',
    'shelter-rescue': 'apes-shelter-rescue',
    apes_shelter_rescue: 'apes-shelter-rescue',
    'pet-care-clinic': 'apes-pet-care-clinic',
    apes_pet_care_clinic: 'apes-pet-care-clinic',
};

export function channelMeta(value: string): ChannelMeta | undefined {
    return channelMetaBySlug[slugAliases[value] ?? value];
}

export function canonicalChannelSlug(value: string): string {
    return slugAliases[value] ?? value;
}
