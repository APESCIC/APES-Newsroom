import { Link } from '@inertiajs/react';

export default function SiteFooter() {
    return (
        <footer className="border-t border-neutral-200 py-8">
            <div className="mx-auto flex max-w-5xl flex-wrap gap-4 px-6 text-sm text-neutral-600">
                <Link href="/legal/privacy">Privacy</Link>
                <Link href="/legal/cookies">Cookies</Link>
                <Link href="/legal/rights">Your rights</Link>
                <Link href="/mailing/signup">Mailing lists</Link>
            </div>
        </footer>
    );
}
