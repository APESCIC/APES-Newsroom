import { Head, Link } from '@inertiajs/react';

type PostCard = {
    title: string;
    slug: string;
    excerpt: string | null;
    channel: string;
    channel_slug: string;
    author: string;
    published_at: string | null;
};

type Paginated = {
    data: PostCard[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

function ArchiveShell({
    title,
    heading,
    posts,
}: {
    title: string;
    heading: string;
    posts: Paginated;
}) {
    return (
        <>
            <Head title={title} />
            <main className="mx-auto max-w-3xl px-6 py-12">
                <Link href="/" className="text-sm text-neutral-600 underline">
                    Home
                </Link>
                <h1 className="mt-4 text-3xl font-semibold">{heading}</h1>
                {posts.data.length === 0 ? (
                    <p className="mt-6 text-neutral-600">No published stories in this archive.</p>
                ) : (
                    <ul className="mt-6 space-y-4">
                        {posts.data.map((post) => (
                            <li key={post.slug} className="border-b border-neutral-200 pb-4">
                                <p className="text-sm text-apes-primary">{post.channel}</p>
                                <Link href={`/articles/${post.slug}`} className="text-lg font-semibold hover:underline">
                                    {post.title}
                                </Link>
                                {post.excerpt && <p className="mt-1 text-sm text-neutral-600">{post.excerpt}</p>}
                            </li>
                        ))}
                    </ul>
                )}
                <nav className="mt-8 flex flex-wrap gap-2 text-sm" aria-label="Pagination">
                    {posts.links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url}
                                className={link.active ? 'font-semibold underline' : 'underline'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span key={`${link.label}-${index}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ),
                    )}
                </nav>
            </main>
        </>
    );
}

export default function AuthorArchive({
    author,
    posts,
}: {
    author: { id: number; name: string };
    posts: Paginated;
}) {
    return <ArchiveShell title={`Articles by ${author.name}`} heading={`Articles by ${author.name}`} posts={posts} />;
}
