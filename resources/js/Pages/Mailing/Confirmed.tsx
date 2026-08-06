import { Head, Link } from '@inertiajs/react';

export default function Confirmed({ list }: { list: string }) {
    return (
        <>
            <Head title="Subscription confirmed" />
            <main className="mx-auto max-w-lg px-6 py-12">
                <h1 className="text-2xl font-semibold">Subscription confirmed</h1>
                <p className="mt-2 text-neutral-700">You are confirmed for {list}.</p>
                <p className="mt-6 text-sm">
                    <Link href="/">Back to home</Link>
                </p>
            </main>
        </>
    );
}
