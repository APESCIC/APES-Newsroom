import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AccountMenu from './AccountMenu';
import SiteFooter from './SiteFooter';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-page-tint text-neutral-900">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:outline focus:outline-2 focus:outline-focus"
            >
                Skip to main content
            </a>
            <header className="border-b border-[#d8e8df] bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-apes-primary text-sm font-extrabold text-white">
                            A
                        </span>
                        <span className="text-base font-semibold text-apes-primary">APES Newsroom</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/search" className="text-sm text-neutral-600 hover:text-neutral-900">
                            Search
                        </Link>
                        <AccountMenu />
                    </div>
                </div>
            </header>
            {children}
            <SiteFooter />
        </div>
    );
}
