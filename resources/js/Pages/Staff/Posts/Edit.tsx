import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import type { OutputData } from '@editorjs/editorjs';
import EditorJsField from '../../../Components/editor/EditorJsField';

type Channel = { value: string; label: string };
type MailingListOption = { value: string; label: string };
type Revision = { id: number; title: string; editor: string | null; created_at: string | null };

type PostData = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: OutputData;
    status: string;
    channel: string;
    hero_image: string | null;
    hero_image_alt: string | null;
    hero_image_caption: string | null;
    hero_image_credit: string | null;
    meta_title: string | null;
    meta_description: string | null;
    canonical_url: string | null;
    scheduled_for: string | null;
    email_on_publish: boolean;
    mailing_lists: string[];
    review_notes: string | null;
    tags: string[];
    updated_at: string | null;
};

const emptyContent: OutputData = {
    time: Date.now(),
    blocks: [{ type: 'paragraph', data: { text: '' } }],
    version: '2.29.0',
};

type PostForm = {
    title: string;
    slug: string;
    excerpt: string;
    content: OutputData;
    channel: string;
    hero_image: string;
    hero_image_alt: string;
    hero_image_caption: string;
    hero_image_credit: string;
    meta_title: string;
    meta_description: string;
    canonical_url: string;
    email_on_publish: boolean;
    mailing_lists: string[];
    tags: string[];
    expected_updated_at: string;
};

export default function PostEdit({
    post,
    channels,
    mailingLists,
    canPublish,
    revisions,
}: {
    post: PostData | null;
    channels: Channel[];
    mailingLists: MailingListOption[];
    canPublish: boolean;
    revisions: Revision[];
}) {
    const isNew = post === null;
    const { errors } = usePage().props as { errors: Record<string, string> };
    const [scheduleAt, setScheduleAt] = useState(post?.scheduled_for ?? '');
    const [rejectNotes, setRejectNotes] = useState('');
    const [tagInput, setTagInput] = useState((post?.tags ?? []).join(', '));
    const autosaveTimer = useRef<number | null>(null);

    const { data, setData, post: submitPost, patch, processing, transform } = useForm<PostForm>({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? emptyContent,
        channel: post?.channel ?? channels[0]?.value ?? 'apes_cic',
        hero_image: post?.hero_image ?? '',
        hero_image_alt: post?.hero_image_alt ?? '',
        hero_image_caption: post?.hero_image_caption ?? '',
        hero_image_credit: post?.hero_image_credit ?? '',
        meta_title: post?.meta_title ?? '',
        meta_description: post?.meta_description ?? '',
        canonical_url: post?.canonical_url ?? '',
        email_on_publish: post?.email_on_publish ?? false,
        mailing_lists: post?.mailing_lists ?? [],
        tags: post?.tags ?? [],
        expected_updated_at: post?.updated_at ?? '',
    });

    transform((form) => ({
        ...form,
        tags: tagInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
    }));

    useEffect(() => {
        if (isNew || !post) {
            return;
        }

        if (autosaveTimer.current) {
            window.clearTimeout(autosaveTimer.current);
        }

        autosaveTimer.current = window.setTimeout(() => {
            patch(`/staff/posts/${post.id}`, { preserveScroll: true });
        }, 8000);

        return () => {
            if (autosaveTimer.current) {
                window.clearTimeout(autosaveTimer.current);
            }
        };
    }, [data, isNew, post, patch]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isNew) {
            submitPost('/staff/posts');
        } else {
            patch(`/staff/posts/${post.id}`);
        }
    };

    const toggleList = (value: string) => {
        setData(
            'mailing_lists',
            data.mailing_lists.includes(value)
                ? data.mailing_lists.filter((l) => l !== value)
                : [...data.mailing_lists, value],
        );
    };

    const action = (url: string, body?: Record<string, string>) => {
        router.post(url, body ?? {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title={isNew ? 'New post' : `Edit: ${post.title}`} />
            <main className="mx-auto max-w-3xl px-6 py-12">
                <Link href="/staff/posts" className="text-sm text-teal-deep hover:underline">
                    ← Posts
                </Link>
                <h1 className="mt-4 text-2xl font-semibold">{isNew ? 'New draft' : 'Edit draft'}</h1>
                {!isNew && (
                    <p className="mt-1 text-sm text-muted">
                        Status: {post.status}{' '}
                        <Link href={`/staff/posts/${post.id}/preview`} className="underline">
                            Preview
                        </Link>
                        {' · '}
                        <Link href={`/staff/posts/${post.id}/campaign`} className="underline">
                            Campaign preview
                        </Link>
                    </p>
                )}
                {post?.review_notes && (
                    <p className="mt-3 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        Review notes: {post.review_notes}
                    </p>
                )}
                {errors.conflict && (
                    <p className="mt-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
                        {errors.conflict}
                    </p>
                )}

                <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>
                    <div>
                        <label htmlFor="slug">Slug</label>
                        <input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="channel">Channel</label>
                        <select
                            id="channel"
                            value={data.channel}
                            onChange={(e) => setData('channel', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        >
                            {channels.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="excerpt">Excerpt</label>
                        <textarea
                            id="excerpt"
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            rows={2}
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="tags">Tags (comma-separated)</label>
                        <input
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="body">Body</label>
                        <EditorJsField
                            initialData={data.content}
                            onChange={(content) => setData('content', content)}
                        />
                        {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                    </div>

                    <fieldset className="flex flex-col gap-3 border-t pt-4">
                        <legend className="font-medium">Hero image</legend>
                        <input
                            placeholder="Image URL"
                            value={data.hero_image}
                            onChange={(e) => setData('hero_image', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            placeholder="Alt text"
                            value={data.hero_image_alt}
                            onChange={(e) => setData('hero_image_alt', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            placeholder="Caption"
                            value={data.hero_image_caption}
                            onChange={(e) => setData('hero_image_caption', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            placeholder="Credit"
                            value={data.hero_image_credit}
                            onChange={(e) => setData('hero_image_credit', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                    </fieldset>

                    <fieldset className="flex flex-col gap-3 border-t pt-4">
                        <legend className="font-medium">SEO</legend>
                        <input
                            placeholder="Meta title"
                            value={data.meta_title}
                            onChange={(e) => setData('meta_title', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <textarea
                            placeholder="Meta description"
                            value={data.meta_description}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            rows={2}
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            placeholder="Canonical URL"
                            value={data.canonical_url}
                            onChange={(e) => setData('canonical_url', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                    </fieldset>

                    <fieldset className="flex flex-col gap-3 border-t pt-4">
                        <legend className="font-medium">Email campaign</legend>
                        <label className="flex gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={data.email_on_publish}
                                onChange={(e) => setData('email_on_publish', e.target.checked)}
                            />
                            Email this post on publish
                        </label>
                        {data.email_on_publish && (
                            <div className="flex flex-col gap-2 pl-6">
                                {mailingLists.map((list) => (
                                    <label key={list.value} className="flex gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={data.mailing_lists.includes(list.value)}
                                            onChange={() => toggleList(list.value)}
                                        />
                                        {list.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </fieldset>

                    <div className="flex flex-wrap gap-2 border-t pt-4">
                        <button type="submit" disabled={processing} className="rounded bg-apes-primary px-4 py-2 text-white">
                            {isNew ? 'Create draft' : 'Save'}
                        </button>
                        {!isNew && (
                            <button
                                type="button"
                                className="rounded border px-4 py-2"
                                onClick={() => action(`/staff/posts/${post.id}/submit`)}
                            >
                                Submit for review
                            </button>
                        )}
                        {!isNew && canPublish && (
                            <>
                                <button
                                    type="button"
                                    className="rounded border px-4 py-2"
                                    onClick={() => action(`/staff/posts/${post.id}/publish`)}
                                >
                                    Publish
                                </button>
                                <button
                                    type="button"
                                    className="rounded border px-4 py-2"
                                    onClick={() => action(`/staff/posts/${post.id}/unpublish`)}
                                >
                                    Unpublish
                                </button>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="datetime-local"
                                        value={scheduleAt}
                                        onChange={(e) => setScheduleAt(e.target.value)}
                                        className="rounded border px-2 py-1 text-sm"
                                    />
                                    <button
                                        type="button"
                                        className="rounded border px-4 py-2"
                                        onClick={() =>
                                            action(`/staff/posts/${post.id}/schedule`, {
                                                scheduled_for: scheduleAt,
                                            })
                                        }
                                    >
                                        Schedule
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        value={rejectNotes}
                                        onChange={(e) => setRejectNotes(e.target.value)}
                                        placeholder="Rejection notes"
                                        className="rounded border px-2 py-1 text-sm"
                                    />
                                    <button
                                        type="button"
                                        className="rounded border px-4 py-2"
                                        onClick={() =>
                                            action(`/staff/posts/${post.id}/reject`, {
                                                review_notes: rejectNotes,
                                            })
                                        }
                                    >
                                        Reject
                                    </button>
                                </div>
                            </>
                        )}
                        {!isNew && (
                            <button
                                type="button"
                                className="rounded border border-red-300 px-4 py-2 text-red-700"
                                onClick={() => router.delete(`/staff/posts/${post.id}`)}
                            >
                                Soft delete
                            </button>
                        )}
                    </div>
                </form>

                {!isNew && revisions.length > 0 && (
                    <section className="mt-10 border-t pt-6">
                        <h2 className="text-lg font-medium">Revisions</h2>
                        <ul className="mt-3 space-y-2 text-sm">
                            {revisions.map((revision) => (
                                <li key={revision.id} className="flex items-center justify-between gap-4">
                                    <span>
                                        {revision.title} — {revision.editor ?? 'Unknown'} —{' '}
                                        {revision.created_at
                                            ? new Date(revision.created_at).toLocaleString('en-GB')
                                            : '—'}
                                    </span>
                                    <button
                                        type="button"
                                        className="underline"
                                        onClick={() =>
                                            router.post(`/staff/posts/${post.id}/revisions/${revision.id}/restore`)
                                        }
                                    >
                                        Restore
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </>
    );
}
