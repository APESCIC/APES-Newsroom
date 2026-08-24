import { Head, Link } from '@inertiajs/react';
import { channelMeta } from '../../channelMeta';
import PublicLayout from '../../Components/Layout/PublicLayout';

type Post = {
    title: string;
    slug: string;
    excerpt: string | null;
    author: string;
    published_at: string | null;
};

export default function ChannelShow({
    channel,
    posts,
}: {
    channel: { slug: string; label: string };
    posts: { data: Post[] };
}) {
    const meta = channelMeta(channel.slug);
    const tintClass =
        meta?.accent === 'apes' ? 'glass-channel-apes' :
        meta?.accent === 'shelter' ? 'glass-channel-shelter' :
        meta?.accent === 'clinic' ? 'glass-channel-clinic' :
        '';

    return (
        <PublicLayout>
            <Head title={channel.label} />
            <main id="main-content">
                <div className="px-5 py-12 sm:px-6">
                    <div className={`glass-panel mx-auto max-w-public rounded-card p-8 ${tintClass}`}>
                        <p className="eyebrow-on-glass">Channel</p>
                        <h1 className="mt-2 text-2xl font-bold text-on-glass sm:text-3xl">{channel.label}</h1>
                        {meta?.description && <p className="mt-2 max-w-2xl text-on-glass-muted">{meta.description}</p>}
                    </div>
                </div>
                <div className="mx-auto max-w-public px-5 pb-12 sm:px-6">
                    {posts.data.length === 0 ? (
                        <p className="text-on-glass-muted">No published stories in this channel yet.</p>
                    ) : (
                        <ul className="grid gap-8 md:grid-cols-2">
                            {posts.data.map((post) => (
                                <li key={post.slug} className="glass-story-card">
                                    <h2 className="text-lg font-bold text-on-glass">
                                        <Link href={`/articles/${post.slug}`} className="hover:text-brand-teal hover:underline">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    {post.excerpt && <p className="mt-2 text-sm leading-6 text-on-glass-muted">{post.excerpt}</p>}
                                    <p className="mt-3 text-xs font-semibold text-on-glass-muted">{post.author}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}
