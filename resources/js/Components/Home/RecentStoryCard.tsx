import { Link } from '@inertiajs/react';
import { channelMeta } from '../../channelMeta';
import LineIcon from '../Icons/LineIcon';
import type { PostCard } from './DeskPanel';

export default function RecentStoryCard({ post }: { post: PostCard }) {
    const meta = channelMeta(post.channel_slug);
    return (
        <article className="group">
            <div className={`flex aspect-video items-center justify-center overflow-hidden rounded-control border border-border ${meta?.mediaClass ?? 'bg-brand-mist text-teal-deep'}`}>
                <LineIcon name={meta?.icon ?? 'document'} className="h-16 w-16" />
            </div>
            <span className={`mt-4 inline-flex rounded-control px-2 py-1 text-[0.625rem] font-bold tracking-wide uppercase ${meta?.badgeClass ?? 'bg-brand-mist text-teal-deep'}`}>
                {meta?.label ?? post.channel}
            </span>
            <h3 className="mt-2 text-lg leading-snug font-bold text-body">
                <Link href={`/articles/${post.slug}`} className="group-hover:text-teal-deep hover:underline">
                    {post.title}
                </Link>
            </h3>
        </article>
    );
}
