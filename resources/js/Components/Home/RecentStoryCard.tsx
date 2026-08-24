import { Link } from '@inertiajs/react';
import { channelMeta } from '../../channelMeta';
import LineIcon from '../Icons/LineIcon';
import { formatStoryDate, type PostCard } from './DeskPanel';

type RecentStoryCardProps = {
    post: PostCard;
    variant?: 'default' | 'lead';
};

export default function RecentStoryCard({ post, variant = 'default' }: RecentStoryCardProps) {
    const meta = channelMeta(post.channel_slug);
    const published = formatStoryDate(post.published_at);
    const isLead = variant === 'lead';

    return (
        <article className={`group ${isLead ? 'md:col-span-2' : ''}`}>
            <div
                className={`flex items-center justify-center overflow-hidden rounded-control border border-border ${
                    isLead ? 'aspect-[16/9]' : 'aspect-video'
                } ${meta?.mediaClass ?? 'bg-brand-mist text-teal-deep'}`}
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
                    <LineIcon name={meta?.icon ?? 'document'} className={isLead ? 'h-20 w-20' : 'h-16 w-16'} />
                )}
            </div>
            <span className={`mt-4 inline-flex rounded-control px-2 py-1 text-[0.625rem] font-bold tracking-wide uppercase ${meta?.badgeClass ?? 'bg-brand-mist text-teal-deep'}`}>
                {meta?.label ?? post.channel}
            </span>
            <h3 className={`mt-2 leading-snug font-bold text-body ${isLead ? 'text-xl' : 'text-lg'}`}>
                <Link href={`/articles/${post.slug}`} className="group-hover:text-teal-deep hover:underline">
                    {post.title}
                </Link>
            </h3>
            {post.excerpt && (
                <p className={`mt-3 leading-6 text-muted ${isLead ? 'text-base' : 'text-sm'}`}>{post.excerpt}</p>
            )}
            {published && (
                <time dateTime={post.published_at ?? undefined} className="mt-3 block text-xs font-semibold text-muted">
                    {published}
                </time>
            )}
        </article>
    );
}
