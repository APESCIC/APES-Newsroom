import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type ProfileData = {
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    public_opt_in: boolean;
    moderation_status: string;
    moderation_notes: string | null;
};

export default function PublicProfile({ profile, status }: { profile: ProfileData; status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        display_name: profile.display_name ?? '',
        bio: profile.bio ?? '',
        public_opt_in: profile.public_opt_in,
        avatar: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/account/public-profile', { forceFormData: true });
    };

    return (
        <>
            <Head title="Public profile" />
            <main className="mx-auto max-w-lg px-6 py-12">
                <Link href="/account" className="text-sm underline">
                    ← Account
                </Link>
                <h1 className="mt-4 text-2xl font-semibold">Public profile</h1>
                <p className="mt-2 text-sm text-neutral-600">
                    Profiles are private by default. Opting in submits your profile for moderation before it appears
                    publicly.
                </p>
                <p className="mt-2 text-sm">
                    Status: <strong>{profile.moderation_status}</strong>
                </p>
                {profile.moderation_notes && (
                    <p className="mt-1 text-sm text-red-700">Moderator note: {profile.moderation_notes}</p>
                )}
                {status === 'profile-submitted' && (
                    <p className="mt-2 text-sm text-green-700">Profile saved. Public changes await moderation.</p>
                )}

                <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
                    <div>
                        <label htmlFor="display_name">Display name</label>
                        <input
                            id="display_name"
                            value={data.display_name}
                            onChange={(e) => setData('display_name', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.display_name && <p className="text-sm text-red-600">{errors.display_name}</p>}
                    </div>
                    <div>
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            rows={4}
                            maxLength={500}
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="avatar">Avatar</label>
                        <input
                            id="avatar"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                        />
                        {errors.avatar && <p className="text-sm text-red-600">{errors.avatar}</p>}
                    </div>
                    <label className="flex gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={data.public_opt_in}
                            onChange={(e) => setData('public_opt_in', e.target.checked)}
                        />
                        Make my profile public after approval
                    </label>
                    <button type="submit" disabled={processing} className="w-fit rounded bg-apes-primary px-4 py-2 text-white">
                        Save profile
                    </button>
                </form>
            </main>
        </>
    );
}
