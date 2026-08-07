import { Head, Link } from '@inertiajs/react';
import { channelMeta } from '../../../channelMeta';
import LineIcon from '../../../Components/Icons/LineIcon';
import WorkspaceLayout from '../../../Components/Layout/WorkspaceLayout';

type Post = {
    id: number;
    title: string;
    slug: string;
    status: string;
    channel: string;
    updated_at: string | null;
    author: string;
};

function postStatus(status: string) {
    const labels: Record<string, { label: string; className: string }> = {
        draft: { label: 'Draft', className: 'bg-brand-mist text-teal-deep' },
        in_review: { label: 'In review', className: 'bg-warning-mist text-warning' },
        published: { label: 'Published', className: 'bg-success-mist text-success' },
        archived: { label: 'Archived', className: 'bg-neutral-100 text-muted' },
    };

    return labels[status] ?? { label: status.replaceAll('_', ' '), className: 'bg-neutral-100 text-muted' };
}

function formatDate(value: string | null) {
    return value ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(value)) : '—';
}

function StatusBadge({ status }: { status: string }) {
    const meta = postStatus(status);
    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${meta.className}`}>{meta.label}</span>;
}

function ChannelLabel({ value }: { value: string }) {
    const meta = channelMeta(value);
    return (
        <span className={`inline-flex rounded border border-border px-2 py-1 text-[0.625rem] font-bold tracking-wide uppercase ${meta?.badgeClass ?? 'bg-neutral-100 text-muted'}`}>
            {meta?.label ?? value.replaceAll('_', ' ')}
        </span>
    );
}

export default function PostsIndex({
    posts,
    filterStatus,
    canReview,
}: {
    posts: Post[];
    filterStatus: string | null;
    canReview: boolean;
}) {
    const filters = [
        { href: '/staff/posts', value: null, label: 'All' },
        { href: '/staff/posts?status=in_review', value: 'in_review', label: 'In review' },
        { href: '/staff/posts?status=published', value: 'published', label: 'Published' },
    ];

    const actions = (
        <div className="flex flex-wrap gap-3">
            {canReview && (
                <Link href="/staff/posts/review" className="button-secondary">
                    <LineIcon name="review" className="h-4 w-4" />
                    Review queue
                </Link>
            )}
            <Link href="/staff/posts/new" className="button-primary">
                <LineIcon name="plus" className="h-4 w-4" />
                New draft
            </Link>
        </div>
    );

    return (
        <WorkspaceLayout
            area="Staff"
            active="posts"
            title="Posts"
            subtitle="Manage and publish editorial content"
            actions={actions}
        >
            <Head title="Staff — Posts" />
            <main id="main-content" className="mx-auto max-w-[62.5rem] px-5 py-6 sm:px-6">
                <nav aria-label="Post status filters" className="border-b border-border">
                    <ul className="flex gap-1 overflow-x-auto">
                        {filters.map((filter) => {
                            const active = filterStatus === filter.value;
                            return (
                                <li key={filter.label}>
                                    <Link
                                        href={filter.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex min-h-11 items-center border-b-2 px-4 py-3 text-sm font-semibold ${
                                            active ? 'border-teal-deep text-teal-deep' : 'border-transparent text-muted hover:text-body'
                                        }`}
                                    >
                                        {filter.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {posts.length > 0 ? (
                    <>
                        <div className="mt-6 hidden overflow-hidden rounded-card border border-border bg-white md:block">
                            <table aria-label="Newsroom posts" className="w-full text-left text-sm">
                                <thead className="bg-page-tint text-xs tracking-wide text-muted uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-bold">Title</th>
                                        <th scope="col" className="px-4 py-4 font-bold">Status</th>
                                        <th scope="col" className="px-4 py-4 font-bold">Channel</th>
                                        <th scope="col" className="px-6 py-4 font-bold">Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {posts.map((post) => (
                                        <tr key={post.id} className={`hover:bg-page-tint/70 ${post.status === 'in_review' ? 'border-l-4 border-warning' : ''}`}>
                                            <td className="px-6 py-5">
                                                <Link
                                                    href={`/staff/posts/${post.id}/edit`}
                                                    aria-label={`Edit ${post.title}`}
                                                    className="font-bold text-brand-ink hover:text-teal-deep hover:underline"
                                                >
                                                    {post.title}
                                                </Link>
                                                <p className="mt-1 text-xs text-muted">By {post.author}</p>
                                            </td>
                                            <td className="px-4 py-5"><StatusBadge status={post.status} /></td>
                                            <td className="px-4 py-5"><ChannelLabel value={post.channel} /></td>
                                            <td className="px-6 py-5 text-muted">{formatDate(post.updated_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <ul aria-label="Newsroom posts on small screens" className="mt-6 space-y-4 md:hidden">
                            {posts.map((post) => (
                                <li key={post.id} className={`rounded-card border border-border bg-white p-5 ${post.status === 'in_review' ? 'border-l-4 border-l-warning' : ''}`}>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <StatusBadge status={post.status} />
                                        <span className="text-xs text-muted">{formatDate(post.updated_at)}</span>
                                    </div>
                                    <h2 className="mt-4 text-lg font-bold text-brand-ink">
                                        <Link href={`/staff/posts/${post.id}/edit`} className="hover:text-teal-deep hover:underline">{post.title}</Link>
                                    </h2>
                                    <p className="mt-2 text-sm text-muted"><ChannelLabel value={post.channel} /> · {post.author}</p>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <div className="mt-6 rounded-card border border-border bg-white p-10 text-center">
                        <LineIcon name="document" className="mx-auto h-10 w-10 text-teal-deep" />
                        <h2 className="mt-4 text-xl font-bold text-brand-ink">No posts found</h2>
                        <p className="mt-2 text-muted">Try another status filter or start a new draft.</p>
                    </div>
                )}
            </main>
        </WorkspaceLayout>
    );
}
