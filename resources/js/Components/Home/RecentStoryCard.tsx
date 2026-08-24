import { Link } from '@inertiajs/react';
import { channelMeta } from '../../channelMeta';
import LineIcon from '../Icons/LineIcon';
import { formatStoryDate, type PostCard } from './DeskPanel';

type RecentStoryCardProps = {
    post: PostCard;
    variant?: 'default' | 'lead';
};

export default function RecentStoryCard({ post }: RecentStoryCardProps) {
    const meta = channelMeta(post.channel_slug);
    const published = formatStoryDate(post.published_at);

    return (
        <article className="glass-story-card group">
            <div
                className={`flex aspect-video items-center justify-center overflow-hidden rounded-control border border-white/15 ${
                    meta?.mediaClass ?? 'bg-white/5 text-brand-teal'
                }`}
            >
                {post.hero_image ? (
                    <img
                        src={post.hero_image}
                        alt={post.hero_image_alt ?? ''}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <LineIcon name={meta?.icon ?? 'document'} className="h-16 w-16" />
                )}
            </div>
            <span className={`mt-4 inline-flex rounded-control px-2 py-1 text-[0.625rem] font-bold tracking-wide uppercase ${meta?.badgeClass ?? 'bg-white/10 text-brand-teal'}`}>
                {meta?.label ?? post.channel}
            </span>
            <h3 className="mt-2 text-lg leading-snug font-bold text-on-glass">
                <Link href={`/articles/${post.slug}`} className="group-hover:text-brand-teal hover:underline">
                    {post.title}
                </Link>
            </h3>
            {post.excerpt && (
                <p className="mt-3 text-sm leading-6 text-on-glass-muted">{post.excerpt}</p>
            )}
            {published && (
                <time dateTime={post.published_at ?? undefined} className="mt-3 block text-xs font-semibold text-on-glass-muted">
                    {published}
                </time>
            )}
        </article>
    );
}
