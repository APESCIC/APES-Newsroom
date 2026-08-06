import { Head, router } from '@inertiajs/react';

type PendingProfile = {
    id: number;
    display_name: string | null;
    bio: string | null;
    user_name: string;
    updated_at: string | null;
};

type PendingComment = {
    id: number;
    body: string;
    user_name: string;
    post_title: string;
    post_slug: string;
    created_at: string | null;
};

type Report = {
    id: number;
    reason: string;
    reportable_type: string;
    reportable_id: number;
    reporter: string | null;
    created_at: string | null;
};

type Suspended = {
    id: number;
    display_name: string | null;
    user_name: string;
    notes: string | null;
};

export default function ModerationIndex({
    profiles,
    comments,
    reports = [],
    suspended = [],
}: {
    profiles: PendingProfile[];
    comments: PendingComment[];
    reports?: Report[];
    suspended?: Suspended[];
}) {
    const moderateProfile = (id: number, status: string) => {
        router.post(`/admin/moderation/profiles/${id}`, { status });
    };

    const moderateComment = (id: number, status: string) => {
        router.post(`/admin/moderation/comments/${id}`, { status });
    };

    return (
        <>
            <Head title="Moderation" />
            <main className="mx-auto max-w-3xl px-6 py-12">
                <h1 className="text-2xl font-semibold">Moderation queue</h1>

                <section className="mt-8">
                    <h2 className="text-lg font-medium">Profiles ({profiles.length})</h2>
                    <ul className="mt-4 flex flex-col gap-4">
                        {profiles.map((profile) => (
                            <li key={profile.id} className="rounded border p-4">
                                <p className="font-medium">{profile.display_name ?? 'Untitled'}</p>
                                <p className="text-sm text-neutral-600">Account: {profile.user_name}</p>
                                {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="rounded bg-green-700 px-3 py-1 text-sm text-white"
                                        onClick={() => moderateProfile(profile.id, 'approved')}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded bg-red-700 px-3 py-1 text-sm text-white"
                                        onClick={() => moderateProfile(profile.id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded border px-3 py-1 text-sm"
                                        onClick={() => moderateProfile(profile.id, 'suspended')}
                                    >
                                        Suspend
                                    </button>
                                </div>
                            </li>
                        ))}
                        {profiles.length === 0 && <li className="text-sm text-neutral-600">No pending profiles.</li>}
                    </ul>
                </section>

                <section className="mt-10">
                    <h2 className="text-lg font-medium">Comments ({comments.length})</h2>
                    <ul className="mt-4 flex flex-col gap-4">
                        {comments.map((comment) => (
                            <li key={comment.id} className="rounded border p-4">
                                <p className="text-sm text-neutral-600">
                                    {comment.user_name} on {comment.post_title}
                                </p>
                                <p className="mt-2">{comment.body}</p>
                                <div className="mt-3 flex gap-2">
                                    <button
                                        type="button"
                                        className="rounded bg-green-700 px-3 py-1 text-sm text-white"
                                        onClick={() => moderateComment(comment.id, 'approved')}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded bg-red-700 px-3 py-1 text-sm text-white"
                                        onClick={() => moderateComment(comment.id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                        {comments.length === 0 && <li className="text-sm text-neutral-600">No pending comments.</li>}
                    </ul>
                </section>

                <section className="mt-10">
                    <h2 className="text-lg font-medium">Open reports ({reports.length})</h2>
                    <ul className="mt-4 flex flex-col gap-4">
                        {reports.map((report) => (
                            <li key={report.id} className="rounded border p-4">
                                <p className="text-sm text-neutral-600">
                                    {report.reportable_type} #{report.reportable_id} — {report.reporter}
                                </p>
                                <p className="mt-2">{report.reason}</p>
                                <div className="mt-3 flex gap-2">
                                    <button
                                        type="button"
                                        className="rounded border px-3 py-1 text-sm"
                                        onClick={() =>
                                            router.post(`/admin/moderation/reports/${report.id}`, {
                                                status: 'resolved',
                                            })
                                        }
                                    >
                                        Resolve
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded border px-3 py-1 text-sm"
                                        onClick={() =>
                                            router.post(`/admin/moderation/reports/${report.id}`, {
                                                status: 'dismissed',
                                            })
                                        }
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </li>
                        ))}
                        {reports.length === 0 && <li className="text-sm text-neutral-600">No open reports.</li>}
                    </ul>
                </section>

                <section className="mt-10">
                    <h2 className="text-lg font-medium">Suspended ({suspended.length})</h2>
                    <ul className="mt-4 flex flex-col gap-4">
                        {suspended.map((profile) => (
                            <li key={profile.id} className="rounded border p-4">
                                <p className="font-medium">{profile.display_name ?? profile.user_name}</p>
                                {profile.notes && <p className="mt-1 text-sm text-neutral-600">{profile.notes}</p>}
                                <button
                                    type="button"
                                    className="mt-3 rounded border px-3 py-1 text-sm"
                                    onClick={() => moderateProfile(profile.id, 'private')}
                                >
                                    Lift suspension
                                </button>
                            </li>
                        ))}
                        {suspended.length === 0 && <li className="text-sm text-neutral-600">No suspended profiles.</li>}
                    </ul>
                </section>
            </main>
        </>
    );
}
