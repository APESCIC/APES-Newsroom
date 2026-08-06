import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Channel = { value: string; label: string };
type MailingListOption = { value: string; label: string };

type PostData = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: { blocks: unknown[] };
    status: string;
    channel: string;
    meta_title: string | null;
    meta_description: string | null;
    scheduled_for: string | null;
    email_on_publish: boolean;
    mailing_lists: string[];
};

const emptyContent = {
    time: Date.now(),
    blocks: [{ type: 'paragraph', data: { text: '' } }],
    version: '2.29.0',
};

type PostForm = {
    title: string;
    slug: string;
    excerpt: string;
    content: { time?: number; blocks: Array<{ type: string; data: { text?: string } }>; version?: string };
    channel: string;
    meta_title: string;
    meta_description: string;
    email_on_publish: boolean;
    mailing_lists: string[];
};

export default function PostEdit({
    post,
    channels,
    mailingLists,
}: {
    post: PostData | null;
    channels: Channel[];
    mailingLists: MailingListOption[];
}) {
    const isNew = post === null;

    const { data, setData, post: submitPost, patch, processing, errors } = useForm<PostForm>({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: (post?.content as PostForm['content']) ?? emptyContent,
        channel: post?.channel ?? channels[0]?.value ?? 'apes_cic',
        meta_title: post?.meta_title ?? '',
        meta_description: post?.meta_description ?? '',
        email_on_publish: post?.email_on_publish ?? false,
        mailing_lists: post?.mailing_lists ?? [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isNew) {
            submitPost('/staff/posts');
        } else {
            patch(`/staff/posts/${post.id}`);
        }
    };

    const updateContentText = (text: string) => {
        setData('content', {
            ...data.content,
            blocks: [{ type: 'paragraph', data: { text } }],
        });
    };

    const toggleList = (value: string) => {
        setData(
            'mailing_lists',
            data.mailing_lists.includes(value)
                ? data.mailing_lists.filter((l) => l !== value)
                : [...data.mailing_lists, value],
        );
    };

    const bodyText = data.content.blocks[0]?.data?.text ?? '';

    return (
        <>
            <Head title={isNew ? 'New post' : `Edit: ${post.title}`} />
            <main className="mx-auto max-w-3xl px-6 py-12">
                <Link href="/staff/posts" className="text-sm text-neutral-600 hover:underline">
                    ← Posts
                </Link>
                <h1 className="mt-4 text-2xl font-semibold">{isNew ? 'New draft' : 'Edit draft'}</h1>
                {!isNew && (
                    <p className="mt-1 text-sm text-neutral-600">
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
                        <label htmlFor="body">Body</label>
                        <textarea
                            id="body"
                            value={bodyText}
                            onChange={(e) => updateContentText(e.target.value)}
                            rows={10}
                            className="w-full rounded border px-3 py-2 font-mono text-sm"
                        />
                        {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                    </div>

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

                    <button type="submit" disabled={processing} className="w-fit rounded bg-apes-primary px-4 py-2 text-white">
                        {isNew ? 'Create draft' : 'Save'}
                    </button>
                </form>
            </main>
        </>
    );
}
