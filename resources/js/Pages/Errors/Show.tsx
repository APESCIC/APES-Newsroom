import { Head, Link } from '@inertiajs/react';

export default function ErrorShow({
    status,
    title,
    message,
}: {
    status: number;
    title: string;
    message: string;
}) {
    return (
        <>
            <Head title={title} />
            <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
                <p className="text-sm font-medium text-apes-primary">{status}</p>
                <h1 className="mt-2 text-3xl font-semibold text-neutral-900">{title}</h1>
                <p className="mt-3 text-neutral-600">{message}</p>
                <Link href="/" className="mt-8 text-apes-primary underline">
                    Back to APES Newsroom
                </Link>
            </main>
        </>
    );
}
