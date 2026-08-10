import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type ProfileUser = {
    name: string;
    email: string;
    role: string;
    auth_provider: string | null;
};

type ProfileProps = {
    user: ProfileUser;
    status?: string;
    can_delete_account: boolean;
    deletion_block_reason: string | null;
};

export default function Profile({ user, status, can_delete_account, deletion_block_reason }: ProfileProps) {
    const { data, setData, patch, processing, errors, delete: destroy } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/account');
    };

    const deleteAccount = () => {
        if (confirm('Delete your account permanently? This cannot be undone.')) {
            destroy('/account');
        }
    };
    const deleteError = (errors as Record<string, string>).delete_account;

    return (
        <>
            <Head title="Your account" />
            <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-8 px-6 py-12">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Your account</h1>
                    <p className="mt-1 text-sm text-neutral-600">Manage your profile and data.</p>
                </div>

                {status === 'profile-updated' && <p className="text-sm text-green-700">Profile updated.</p>}
                {status === 'email-verified' && <p className="text-sm text-green-700">Email verified.</p>}

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="name">Name</label>
                        <input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            disabled={user.auth_provider === 'cloudron_oidc'}
                        />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <button type="submit" disabled={processing}>
                        Save changes
                    </button>
                </form>

                <section className="flex flex-col gap-3 border-t border-neutral-200 pt-6">
                    <h2 className="text-lg font-medium">Public profile</h2>
                    <Link href="/account/public-profile" className="text-sm underline">
                        Edit public profile
                    </Link>
                </section>

                <section className="flex flex-col gap-3 border-t border-neutral-200 pt-6">
                    <h2 className="text-lg font-medium">Mailing lists</h2>
                    <Link href="/account/mailing" className="text-sm underline">
                        Manage mailing preferences
                    </Link>
                </section>

                <section className="flex flex-col gap-3 border-t border-neutral-200 pt-6">
                    <h2 className="text-lg font-medium">Your data</h2>
                    <Link href="/account/export" className="text-sm underline">
                        Download account data (JSON)
                    </Link>
                </section>

                <section className="flex flex-col gap-3 border-t border-neutral-200 pt-6">
                    <h2 className="text-lg font-medium text-red-800">Danger zone</h2>
                    {can_delete_account ? (
                        <button type="button" onClick={deleteAccount} className="w-fit text-sm text-red-700 underline">
                            Delete account
                        </button>
                    ) : (
                        <p className="text-sm text-neutral-700">{deletion_block_reason}</p>
                    )}
                    {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
                </section>

                <p className="text-sm">
                    <Link href="/">Back to home</Link>
                </p>
            </main>
        </>
    );
}
