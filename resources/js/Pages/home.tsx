import { Head } from '@inertiajs/react';

/**
 * Placeholder landing page.
 *
 * The real homepage - mission-led hero, featured/recent stories across the
 * three APES channels - lands with issue #6, built against the approved
 * design from issue #2. This exists so the Laravel foundation (issue #3)
 * has one real, working Inertia page to verify the stack end to end.
 */
export default function Home() {
    return (
        <>
            <Head title="Home" />
            <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-4 px-6">
                <h1 className="text-3xl font-semibold text-neutral-900">APES Newsroom</h1>
                <p className="text-neutral-600">
                    Laravel 13 + Inertia + React foundation is running. The public newsroom, publishing
                    workflow, and authenticated workspaces build on top of this in later issues.
                </p>
            </main>
        </>
    );
}
