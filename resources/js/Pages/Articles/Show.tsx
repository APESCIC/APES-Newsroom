import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Comment = {
    id: number;
    body: string;
    created_at: string | null;
    author: { display_name: string; avatar_url: string | null };
};

type Reactions = {
    helpful: number;
    support: number;
    thank_you: number;
    mine: string[];
};

type Article = {
    title: string;
    slug: string;
    excerpt: string | null;
    html: string;
    channel: string;
    channel_slug: string;
    author: string;
    author_id?: number;
    published_at: string | null;
    meta_title: string;
    meta_description: string | null;
    tags?: Array<string | { name: string; slug: string }>;
};

const reactionLabels: Record<string, string> = {
    helpful: 'Helpful',
    support: 'Support',
    thank_you: 'Thank You',
};

export default function ArticleShow({
    article,
    preview,
    comments = [],
    reactions = { helpful: 0, support: 0, thank_you: 0, mine: [] },
    canEngage = false,
    status,
}: {
    article: Article;
    preview?: boolean;
    comments?: Comment[];
    reactions?: Reactions;
    canEngage?: boolean;
    status?: string;
}) {
    const commentForm = useForm({ body: '' });

    const submitComment: FormEventHandler = (e) => {
        e.preventDefault();
        commentForm.post(`/articles/${article.slug}/comments`, {
            onSuccess: () => commentForm.reset('body'),
        });
    };

    const toggleReaction = (type: string) => {
        router.post(`/articles/${article.slug}/reactions`, { type }, { preserveScroll: true });
    };

    return (
        <>
            <Head title={article.meta_title}>
                <meta name="description" content={article.meta_description ?? ''} />
                {preview && <meta name="robots" content="noindex,nofollow" />}
                <meta property="og:title" content={article.meta_title} />
                <meta property="og:description" content={article.meta_description ?? ''} />
                <meta property="og:type" content="article" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: article.title,
                        author: { '@type': 'Person', name: article.author },
                        datePublished: article.published_at,
                    })}
                </script>
            </Head>
            {preview && (
                <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">Preview — not indexed</div>
            )}
            <main className="mx-auto max-w-3xl px-6 py-12">
                <Link href={`/${article.channel_slug}`} className="text-sm text-apes-primary">
                    {article.channel}
                </Link>
                <article>
                    <h1 className="mt-4 text-4xl font-semibold text-neutral-900">{article.title}</h1>
                    <p className="mt-2 text-sm text-neutral-600">
                        By{' '}
                        {article.author_id ? (
                            <Link href={`/authors/${article.author_id}`} className="underline">
                                {article.author}
                            </Link>
                        ) : (
                            article.author
                        )}
                        {article.published_at && (
                            <>
                                {' '}
                                ·{' '}
                                <Link
                                    href={`/archive/${new Date(article.published_at).getUTCFullYear()}`}
                                    className="underline"
                                >
                                    {new Date(article.published_at).toLocaleDateString('en-GB')}
                                </Link>
                            </>
                        )}
                    </p>
                    {article.tags && article.tags.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                            {article.tags.map((tag) => {
                                const name = typeof tag === 'string' ? tag : tag.name;
                                const slug = typeof tag === 'string' ? tag.toLowerCase().replace(/\s+/g, '-') : tag.slug;
                                return (
                                    <li key={slug}>
                                        <Link href={`/tags/${slug}`} className="rounded border px-2 py-0.5 underline">
                                            {name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <div
                        className="prose prose-neutral mt-8 max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.html }}
                    />
                </article>

                {!preview && (
                    <section className="mt-12 border-t border-neutral-200 pt-8" aria-label="Reactions">
                        <h2 className="text-lg font-medium">Reactions</h2>
                        <div className="mt-3 flex flex-wrap gap-3">
                            {Object.entries(reactionLabels).map(([type, label]) => {
                                const active = reactions.mine.includes(type);
                                const count = reactions[type as keyof Omit<Reactions, 'mine'>] ?? 0;
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        disabled={!canEngage}
                                        onClick={() => toggleReaction(type)}
                                        aria-pressed={active}
                                        className={`rounded border px-3 py-1.5 text-sm ${active ? 'border-apes-primary bg-apes-primary/10' : 'border-neutral-300'}`}
                                    >
                                        {label} <span className="tabular-nums">({count})</span>
                                    </button>
                                );
                            })}
                        </div>
                        {!canEngage && (
                            <p className="mt-2 text-sm text-neutral-600">
                                <Link href="/login" className="underline">
                                    Sign in
                                </Link>{' '}
                                with a verified account to react.
                            </p>
                        )}
                    </section>
                )}

                {!preview && (
                    <section className="mt-10 border-t border-neutral-200 pt-8" aria-label="Comments">
                        <h2 className="text-lg font-medium">Comments</h2>
                        {status === 'comment-pending' && (
                            <p className="mt-2 text-sm text-green-700">Thanks — your comment is awaiting moderation.</p>
                        )}

                        <ul className="mt-4 flex flex-col gap-4">
                            {comments.map((comment) => (
                                <li key={comment.id} className="border-b border-neutral-100 pb-4">
                                    <p className="text-sm font-medium">{comment.author.display_name}</p>
                                    <p className="mt-1 text-neutral-800">{comment.body}</p>
                                    {canEngage && (
                                        <button
                                            type="button"
                                            className="mt-2 text-xs text-neutral-600 underline"
                                            onClick={() => {
                                                const reason = window.prompt('Why are you reporting this comment?');
                                                if (!reason) {
                                                    return;
                                                }
                                                router.post('/reports', {
                                                    type: 'comment',
                                                    id: comment.id,
                                                    reason,
                                                });
                                            }}
                                        >
                                            Report
                                        </button>
                                    )}
                                </li>
                            ))}
                            {comments.length === 0 && <li className="text-sm text-neutral-600">No approved comments yet.</li>}
                        </ul>

                        {canEngage ? (
                            <form onSubmit={submitComment} className="mt-6 flex flex-col gap-3">
                                <label htmlFor="comment-body" className="text-sm font-medium">
                                    Add a comment
                                </label>
                                <textarea
                                    id="comment-body"
                                    value={commentForm.data.body}
                                    onChange={(e) => commentForm.setData('body', e.target.value)}
                                    rows={3}
                                    required
                                    maxLength={2000}
                                    className="w-full rounded border px-3 py-2"
                                />
                                {commentForm.errors.body && (
                                    <p className="text-sm text-red-600">{commentForm.errors.body}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={commentForm.processing}
                                    className="w-fit rounded bg-apes-primary px-4 py-2 text-white"
                                >
                                    Submit for moderation
                                </button>
                            </form>
                        ) : (
                            <p className="mt-4 text-sm text-neutral-600">
                                <Link href="/login" className="underline">
                                    Sign in
                                </Link>{' '}
                                with a verified account to comment.
                            </p>
                        )}
                    </section>
                )}
            </main>
        </>
    );
}
