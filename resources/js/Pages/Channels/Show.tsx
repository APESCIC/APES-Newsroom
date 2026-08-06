import { Head, Link } from '@inertiajs/react';

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
        <>
            <Head title={channel.label} />
            <main className="mx-auto max-w-5xl px-6 py-12">
                <Link href="/" className="text-sm text-neutral-600 hover:underline">
                    ← Home
                </Link>
                <h1 className="mt-4 text-3xl font-semibold text-neutral-900">{channel.label}</h1>
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
        </>
    );
}
