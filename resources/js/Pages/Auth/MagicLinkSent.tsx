import { Head } from '@inertiajs/react';

export default function MagicLinkSent() {
    return (
        <>
            <Head title="Check your email" />
            <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6">
                <h1 className="text-2xl font-semibold text-neutral-900">Check your email</h1>
                <p className="text-neutral-600">
                    If an account exists for that address, we&apos;ve sent a sign-in link. It expires in 15 minutes and can only be used
                    once.
                </p>
            </main>
        </>
    );
}
