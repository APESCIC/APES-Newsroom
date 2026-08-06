import { Head, Link } from '@inertiajs/react';

type Post = {
    id: number;
    title: string;
    slug: string;
    status: string;
    channel: string;
    updated_at: string | null;
    author: string;
};

export default function PostsIndex({
    posts,
    filterStatus,
    canReview,
}: {
    posts: Post[];
    filterStatus: string | null;
    canReview: boolean;
}) {
    return (
        <>
            <Head title="Staff — Posts" />
            <main className="mx-auto max-w-4xl px-6 py-12">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Posts</h1>
                    <div className="flex gap-3">
                        {canReview && (
                            <Link href="/staff/posts/review" className="rounded border px-4 py-2">
                                Review queue
                            </Link>
                        )}
                        <Link href="/staff/posts/new" className="rounded bg-apes-primary px-4 py-2 text-white">
                            New draft
                        </Link>
                    </div>
                </div>
                <div className="mt-4 flex gap-3 text-sm">
                    <Link href="/staff/posts" className={!filterStatus ? 'font-semibold underline' : 'underline'}>
                        All
                    </Link>
                    <Link
                        href="/staff/posts?status=in_review"
                        className={filterStatus === 'in_review' ? 'font-semibold underline' : 'underline'}
                    >
                        In review
                    </Link>
                    <Link
                        href="/staff/posts?status=published"
                        className={filterStatus === 'published' ? 'font-semibold underline' : 'underline'}
                    >
                        Published
                    </Link>
                </div>
                <table className="mt-8 w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Title</th>
                            <th>Status</th>
                            <th>Channel</th>
                            <th>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} className="border-b">
                                <td className="py-3">
                                    <Link href={`/staff/posts/${post.id}/edit`} className="font-medium hover:underline">
                                        {post.title}
                                    </Link>
                                </td>
                                <td>{post.status}</td>
                                <td>{post.channel}</td>
                                <td>{post.updated_at ? new Date(post.updated_at).toLocaleDateString('en-GB') : '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </>
    );
}
