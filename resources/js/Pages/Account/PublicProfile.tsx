import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AccountLayout from '../../Components/Layout/AccountLayout';

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
            <AccountLayout
                title="Public profile"
                description="Profiles are private by default. Opting in submits your profile for moderation before it appears publicly."
                backHref="/account"
                backLabel="← Account"
            >
                <p className="mt-4 text-sm text-body">
                    Status: <strong>{profile.moderation_status}</strong>
                </p>
                {profile.moderation_notes && (
                    <p className="status-badge-danger mt-2">Moderator note: {profile.moderation_notes}</p>
                )}
                {status === 'profile-submitted' && (
                    <p className="status-badge-success mt-2">Profile saved. Public changes await moderation.</p>
                )}

                <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                    <div>
                        <label htmlFor="display_name" className="text-sm font-bold text-body">Display name</label>
                        <input
                            id="display_name"
                            value={data.display_name}
                            onChange={(e) => setData('display_name', e.target.value)}
                            className="form-input mt-1"
                        />
                        {errors.display_name && <p className="text-sm text-danger">{errors.display_name}</p>}
                    </div>
                    <div>
                        <label htmlFor="bio" className="text-sm font-bold text-body">Bio</label>
                        <textarea
                            id="bio"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            rows={4}
                            maxLength={500}
                            className="form-input mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="avatar" className="text-sm font-bold text-body">Avatar</label>
                        <input
                            id="avatar"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                            className="mt-1 block text-sm"
                        />
                        {errors.avatar && <p className="text-sm text-danger">{errors.avatar}</p>}
                    </div>
                    <label className="flex gap-2 text-sm text-body">
                        <input
                            type="checkbox"
                            checked={data.public_opt_in}
                            onChange={(e) => setData('public_opt_in', e.target.checked)}
                        />
                        Make my profile public after approval
                    </label>
                    <button type="submit" disabled={processing} className="button-primary w-fit">
                        Save profile
                    </button>
                </form>
            </AccountLayout>
        </>
    );
}
