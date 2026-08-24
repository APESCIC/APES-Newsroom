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
    const headerClass =
        meta?.accent === 'apes' ? 'bg-apes-mist border-apes-primary' :
        meta?.accent === 'shelter' ? 'bg-shelter-mist border-shelter-accent' :
        meta?.accent === 'clinic' ? 'bg-clinic-mist border-clinic-accent' :
        'bg-brand-mist border-brand-teal';

    return (
        <PublicLayout>
            <Head title={channel.label} />
            <main id="main-content">
                <div className={`editorial-rule border-b border-border ${headerClass} px-5 py-12 sm:px-6`}>
                    <div className="mx-auto max-w-public">
                        <p className="eyebrow">Channel</p>
                        <h1 className="mt-2 text-2xl font-bold text-body sm:text-3xl">{channel.label}</h1>
                        {meta?.description && <p className="mt-2 max-w-2xl text-muted">{meta.description}</p>}
                    </div>
                </div>
                <div className="mx-auto max-w-public px-5 py-12 sm:px-6">
                    {posts.data.length === 0 ? (
                        <p className="text-muted">No published stories in this channel yet.</p>
                    ) : (
                        <ul className="grid gap-8 md:grid-cols-2">
                            {posts.data.map((post) => (
                                <li key={post.slug} className="rounded-card border border-border bg-white p-6">
                                    <h2 className="text-lg font-bold text-body">
                                        <Link href={`/articles/${post.slug}`} className="hover:text-teal-deep hover:underline">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    {post.excerpt && <p className="mt-2 text-sm leading-6 text-muted">{post.excerpt}</p>}
                                    <p className="mt-3 text-xs font-semibold text-muted">{post.author}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}
