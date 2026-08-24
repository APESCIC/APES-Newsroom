import { Link } from '@inertiajs/react';
import { canonicalChannelSlug, channelMeta } from '../../channelMeta';
import LineIcon from '../Icons/LineIcon';

export default function ChannelTrailTile({ slug }: { slug: string }) {
    const meta = channelMeta(slug);

    if (!meta) {
        return null;
    }

    const tintClass =
        meta.accent === 'apes' ? 'glass-channel-apes' :
        meta.accent === 'shelter' ? 'glass-channel-shelter' :
        'glass-channel-clinic';

    return (
        <Link
            href={`/${canonicalChannelSlug(slug)}`}
            className={`glass-channel group ${tintClass}`}
        >
            <span className={`flex h-12 w-12 items-center justify-center rounded-control bg-white/10 ${meta.textClass}`}>
                <LineIcon name={meta.icon} className="h-7 w-7" />
            </span>
            <span className="mt-4 text-xl font-bold text-on-glass">{meta.label}</span>
            <span className="mt-2 text-sm leading-6 text-on-glass-muted">{meta.description}</span>
        </Link>
    );
}
