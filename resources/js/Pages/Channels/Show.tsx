import { Head, Link } from '@inertiajs/react';
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
    return (
        <PublicLayout>
            <Head title={channel.label} />
            <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
                <h1 className="text-3xl font-semibold text-neutral-900">{channel.label}</h1>
                <ul className="mt-8 grid gap-6">
                    {posts.data.map((post) => (
                        <li key={post.slug} className="border-b border-neutral-200 pb-6">
                            <h2 className="text-xl font-semibold">
                                <Link href={`/articles/${post.slug}`}>{post.title}</Link>
                            </h2>
                            {post.excerpt && <p className="mt-2 text-neutral-600">{post.excerpt}</p>}
                            <p className="mt-2 text-sm text-neutral-500">{post.author}</p>
                        </li>
                    ))}
                </ul>
            </main>
        </PublicLayout>
    );
}
