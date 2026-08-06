import { Link } from '@inertiajs/react';
import { channelMetaBySlug } from '../../channelMeta';

export default function ChannelTrailTile({ slug, label }: { slug: string; label: string }) {
    const meta = channelMetaBySlug[slug];

    if (!meta) {
        return null;
    }

    return (
        <Link
            href={`/${slug}`}
            className={`flex min-h-11 flex-1 flex-col justify-center rounded-2xl border-2 bg-white p-3 ${meta.borderClass} ${meta.shadowClass} focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-focus`}
        >
            <span className="text-2xl" aria-hidden="true">
                {meta.icon}
            </span>
            <span className="mt-1 text-sm font-extrabold">{label}</span>
            <span className="text-xs text-neutral-600">{meta.hint}</span>
        </Link>
    );
}
