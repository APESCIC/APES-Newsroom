export type ChannelAccent = 'apes' | 'shelter' | 'clinic';

export type ChannelMeta = {
    icon: string;
    hint: string;
    accent: ChannelAccent;
    shadowClass: string;
    borderClass: string;
    badgeClass: string;
};

export const channelMetaBySlug: Record<string, ChannelMeta> = {
    'apes-cic': {
        icon: '🌳',
        hint: 'Mission stories',
        accent: 'apes',
        shadowClass: 'shadow-chunky-apes',
        borderClass: 'border-apes-primary',
        badgeClass: 'bg-[#e8f2ec] text-apes-primary',
    },
    'apes-shelter-rescue': {
        icon: '🏠',
        hint: 'Shelter & rescue updates',
        accent: 'shelter',
        shadowClass: 'shadow-chunky-shelter',
        borderClass: 'border-shelter-accent',
        badgeClass: 'bg-[#f5e6d8] text-shelter-accent',
    },
    'apes-pet-care-clinic': {
        icon: '💉',
        hint: 'Clinic notes',
        accent: 'clinic',
        shadowClass: 'shadow-chunky-clinic',
        borderClass: 'border-clinic-accent',
        badgeClass: 'bg-[#e3f0f7] text-clinic-accent',
    },
};
