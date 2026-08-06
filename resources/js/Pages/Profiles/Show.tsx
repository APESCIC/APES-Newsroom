import { Head } from '@inertiajs/react';

type Profile = {
    display_name: string;
    bio: string | null;
    avatar_url: string | null;
};

export default function ProfileShow({ profile }: { profile: Profile }) {
    return (
        <>
            <Head title={profile.display_name} />
            <main className="mx-auto max-w-lg px-6 py-12">
                {profile.avatar_url && (
                    <img
                        src={profile.avatar_url}
                        alt=""
                        className="h-24 w-24 rounded-full object-cover"
                    />
                )}
                <h1 className="mt-4 text-2xl font-semibold">{profile.display_name}</h1>
                {profile.bio && <p className="mt-3 text-neutral-700">{profile.bio}</p>}
            </main>
        </>
    );
}
