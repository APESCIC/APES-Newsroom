import { Link } from '@inertiajs/react';
import { canonicalChannelSlug, channelMeta } from '../../channelMeta';
import LineIcon from '../Icons/LineIcon';

export default function ChannelTrailTile({ slug }: { slug: string }) {
    const meta = channelMeta(slug);

    if (!meta) {
        return null;
    }

    return (
        <Link
            href={`/${canonicalChannelSlug(slug)}`}
            className="group flex min-h-44 flex-col rounded-card border border-border bg-white p-6 transition-transform hover:-translate-y-1 hover:shadow-elevated"
        >
            <span className={`flex h-12 w-12 items-center justify-center rounded-control ${meta.mediaClass}`}>
                <LineIcon name={meta.icon} className="h-7 w-7" />
            </span>
            <span className="mt-4 text-lg font-bold text-body">{meta.label}</span>
            <span className="mt-2 text-sm leading-6 text-muted">{meta.description}</span>
        </Link>
    );
}
