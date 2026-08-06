import { Link } from '@inertiajs/react';
import { channelMetaBySlug } from '../../channelMeta';

export type PostCard = {
    title: string;
    slug: string;
    excerpt: string | null;
    channel: string;
    channel_slug: string;
    author: string;
    published_at: string | null;
};

export default function DeskPanel({
    featured,
    recent,
}: {
    featured?: PostCard;
    recent: PostCard[];
}) {
    const empty = !featured && recent.length === 0;

    return (
        <section className="rounded-2xl border-2 border-neutral-900 bg-white p-4 shadow-chunky-ink sm:p-5">
            <p className="text-[10px] font-bold tracking-widest text-apes-primary uppercase">On the desk</p>

            {empty ? (
                <p className="mt-4 text-neutral-600">No published stories yet.</p>
            ) : (
                <>
                    {featured && (
                        <article className="mt-3">
                            <p className="text-sm text-apes-primary">{featured.channel}</p>
                            <h2 className="mt-1 text-xl font-extrabold text-[#1b4332] sm:text-2xl">
                                <Link href={`/articles/${featured.slug}`} className="hover:underline">
                                    {featured.title}
                                </Link>
                            </h2>
                            {featured.excerpt && <p className="mt-2 text-sm text-neutral-600">{featured.excerpt}</p>}
                            <Link
                                href={`/articles/${featured.slug}`}
                                className="mt-4 inline-block min-h-11 rounded-lg bg-[#ffd166] px-3 py-2 text-sm font-bold text-[#1b4332]"
                            >
                                Read story →
                            </Link>
                        </article>
                    )}

                    {recent.length > 0 && (
                        <ul className="mt-5 space-y-3 border-t border-dashed border-[#cfe3d7] pt-4">
                            {recent.map((post) => {
                                const meta = channelMetaBySlug[post.channel_slug];

                                return (
                                    <li key={post.slug} className="flex flex-wrap items-center gap-2 text-sm">
                                        <span
                                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${meta?.badgeClass ?? 'bg-neutral-100 text-neutral-600'}`}
                                        >
                                            {post.channel}
                                        </span>
                                        <Link href={`/articles/${post.slug}`} className="font-semibold hover:underline">
                                            {post.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
        </section>
    );
}
