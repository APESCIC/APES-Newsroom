import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Components/Layout/PublicLayout';

type PostCard = {
    title: string;
    slug: string;
    excerpt: string | null;
    channel: string;
};

type Paginated = {
    data: PostCard[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export default function TagArchive({ tag, posts }: { tag: { name: string; slug: string }; posts: Paginated }) {
    return (
        <PublicLayout>
            <Head title={`Tag: ${tag.name}`} />
            <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
                <h1 className="text-3xl font-semibold">Tag: {tag.name}</h1>
                {posts.data.length === 0 ? (
                    <p className="mt-6 text-neutral-600">No published stories with this tag.</p>
                ) : (
                    <ul className="mt-6 space-y-4">
                        {posts.data.map((post) => (
                            <li key={post.slug} className="border-b border-neutral-200 pb-4">
                                <p className="text-sm text-apes-primary">{post.channel}</p>
                                <Link href={`/articles/${post.slug}`} className="text-lg font-semibold hover:underline">
                                    {post.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </PublicLayout>
    );
}
