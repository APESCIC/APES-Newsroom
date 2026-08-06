import { Head, Link } from '@inertiajs/react';

export default function Privacy() {
    return (
        <>
            <Head title="Privacy notice" />
            <main className="mx-auto max-w-3xl px-6 py-12 prose prose-neutral">
                <Link href="/" className="text-sm text-apes-primary no-underline">
                    ← APES Newsroom
                </Link>
                <h1>Privacy notice</h1>
                <p>
                    APES Newsroom is operated by APES CIC. This draft notice explains how we process personal data for
                    public accounts, mailing lists, and community features. It awaits formal legal approval before
                    production cutover.
                </p>
                <h2>What we collect</h2>
                <ul>
                    <li>Account details you provide (name, email, password or magic-link authentication).</li>
                    <li>Mailing list preferences and consent records when you subscribe.</li>
                    <li>Optional public profile, comments, and reactions if you use those features.</li>
                    <li>Technical logs needed to keep the service secure.</li>
                </ul>
                <h2>Your rights</h2>
                <p>
                    See the <Link href="/legal/rights">rights page</Link> for access, export, correction, erasure, and
                    mailing preference controls.
                </p>
                <h2>Contact</h2>
                <p>Privacy questions: use the contact channels published on the APES CIC website.</p>
            </main>
        </>
    );
}
