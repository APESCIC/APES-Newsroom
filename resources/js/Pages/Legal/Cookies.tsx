import { Head, Link } from '@inertiajs/react';

export default function Cookies() {
    return (
        <>
            <Head title="Cookie notice" />
            <main className="mx-auto max-w-3xl px-6 py-12 prose prose-neutral">
                <Link href="/" className="text-sm text-apes-primary no-underline">
                    ← APES Newsroom
                </Link>
                <h1>Cookie notice</h1>
                <p>
                    We use essential cookies and similar storage required to sign you in, protect forms (CSRF), and keep
                    sessions secure. These are strictly necessary for the service to work.
                </p>
                <p>
                    We do not use third-party advertising cookies on the newsroom. Analytics cookies, if introduced later,
                    will only load after an appropriate consent mechanism and updated notice.
                </p>
            </main>
        </>
    );
}
