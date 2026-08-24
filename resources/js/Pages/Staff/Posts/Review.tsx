import { Head, Link } from '@inertiajs/react';

type Post = {
    id: number;
    title: string;
    slug: string;
    status: string;
    channel: string;
    updated_at: string | null;
    author: string;
    review_notes?: string | null;
};

export default function ReviewQueue({ posts }: { posts: Post[] }) {
    return (
        <>
            <Head title="Review queue" />
            <main className="mx-auto max-w-4xl px-6 py-12">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Review queue</h1>
                    <Link href="/staff/posts" className="text-sm underline">
                        All posts
                    </Link>
                </div>
                {posts.length === 0 ? (
                    <p className="mt-8 text-muted">No posts awaiting review.</p>
                ) : (
                    <table className="mt-8 w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Title</th>
                                <th>Author</th>
                                <th>Channel</th>
                                <th>Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b">
                                    <td className="py-3">
                                        <Link
                                            href={`/staff/posts/${post.id}/edit`}
                                            className="font-medium hover:underline"
                                        >
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td>{post.author}</td>
                                    <td>{post.channel}</td>
                                    <td>
                                        {post.updated_at
                                            ? new Date(post.updated_at).toLocaleDateString('en-GB')
                                            : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </>
    );
}
