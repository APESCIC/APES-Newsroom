import { Link } from '@inertiajs/react';
import { canonicalChannelSlug, channelMeta } from '../../channelMeta';
import LineIcon from '../Icons/LineIcon';

export default function ChannelTrailTile({ slug }: { slug: string }) {
    const meta = channelMeta(slug);

    if (!meta) {
        return null;
    }

    const mistClass =
        meta.accent === 'apes' ? 'bg-apes-mist border-apes-primary' :
        meta.accent === 'shelter' ? 'bg-shelter-mist border-shelter-accent' :
        'bg-clinic-mist border-clinic-accent';

    return (
        <Link
            href={`/${canonicalChannelSlug(slug)}`}
            className={`channel-block group ${mistClass}`}
        >
            <span className={`flex h-12 w-12 items-center justify-center rounded-control bg-white/60 ${meta.textClass}`}>
                <LineIcon name={meta.icon} className="h-7 w-7" />
            </span>
            <span className="mt-4 text-xl font-bold text-body">{meta.label}</span>
            <span className="mt-2 text-sm leading-6 text-muted">{meta.description}</span>
        </Link>
    );
}
