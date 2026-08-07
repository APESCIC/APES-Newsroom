import { Link } from '@inertiajs/react';
import ApesLogo from '../Brand/ApesLogo';

export default function SiteFooter() {
    return (
        <footer className="border-t border-border bg-white py-10">
            <div className="mx-auto flex max-w-public flex-col gap-6 px-5 sm:px-6 md:flex-row md:items-center md:justify-between">
                <Link href="/" aria-label="APES Newsroom home" className="inline-flex w-fit rounded-control">
                    <ApesLogo variant="footer" alt="" className="h-16 w-16 object-contain" />
                </Link>
                <nav aria-label="Legal and subscriptions">
                    <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
                        <li><Link href="/legal/privacy" className="hover:text-body">Privacy</Link></li>
                        <li><Link href="/legal/cookies" className="hover:text-body">Cookies</Link></li>
                        <li><Link href="/legal/rights" className="hover:text-body">Your rights</Link></li>
                        <li><Link href="/mailing/signup" className="hover:text-body">Mailing lists</Link></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}
