import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <>
            <Head title="Verify email" />
            <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
                <h1 className="text-2xl font-semibold text-neutral-900">Verify your email</h1>
                <p className="text-sm text-neutral-600">
                    Thanks for registering. Please check your email for a verification link before using your account.
                </p>
                {status === 'verification-link-sent' && (
                    <p className="text-sm text-green-700">A new verification link has been sent to your email address.</p>
                )}
                <form onSubmit={submit}>
                    <button type="submit" disabled={processing}>
                        Resend verification email
                    </button>
                </form>
                <p className="text-sm">
                    <Link href="/logout" method="post" as="button">
                        Log out
                    </Link>
                </p>
            </main>
        </>
    );
}
