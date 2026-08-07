import { Link } from '@inertiajs/react';
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import ApesLogo from '../Brand/ApesLogo';
import LineIcon from '../Icons/LineIcon';
import AccountMenu from './AccountMenu';
import SiteFooter from './SiteFooter';

const primaryLinks = [
    { href: '/', label: 'Home', shortLabel: 'Home' },
    { href: '/apes-cic', label: 'APES', shortLabel: 'APES' },
    { href: '/apes-shelter-rescue', label: 'APES Shelter & Rescue', shortLabel: 'Shelter' },
    { href: '/apes-pet-care-clinic', label: 'APES Pet Care Clinic', shortLabel: 'Clinic' },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuId = useId();
    const menuTriggerRef = useRef<HTMLButtonElement>(null);
    const desktopNavigationRef = useRef<HTMLDivElement>(null);
    const focusMobileMenuTrigger = useCallback(() => menuTriggerRef.current?.focus(), []);
    const focusFirstDesktopDestination = useCallback(
        () => desktopNavigationRef.current?.querySelector<HTMLElement>('a[href]')?.focus(),
        [],
    );

    useEffect(() => {
        if (typeof window.matchMedia !== 'function') return;

        const desktopQuery = window.matchMedia('(min-width: 64rem)');
        const handleBreakpointChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                const mobileTriggerHadFocus = menuTriggerRef.current === document.activeElement;
                if (menuOpen) setMenuOpen(false);
                if (menuOpen || mobileTriggerHadFocus) focusFirstDesktopDestination();
                return;
            }

            const desktopNavigationHadFocus = desktopNavigationRef.current?.contains(document.activeElement) ?? false;
            if (desktopNavigationHadFocus) focusMobileMenuTrigger();
        };

        desktopQuery.addEventListener('change', handleBreakpointChange);
        return () => desktopQuery.removeEventListener('change', handleBreakpointChange);
    }, [focusFirstDesktopDestination, focusMobileMenuTrigger, menuOpen]);

    useEffect(() => {
        if (!menuOpen) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
                menuTriggerRef.current?.focus();
            }
        };

        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [menuOpen]);

    return (
        <div className="min-h-screen bg-page-tint text-body">
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>
            <header className="sticky top-0 z-40 bg-brand-ink text-white">
                <div className="mx-auto flex h-16 max-w-public items-center justify-between gap-6 px-5 sm:px-6">
                    <Link href="/" className="inline-flex shrink-0 rounded-control py-1">
                        <ApesLogo variant="masthead" className="h-12 w-auto object-contain" />
                    </Link>

                    <div ref={desktopNavigationRef} className="hidden items-center gap-5 lg:flex">
                        <nav aria-label="Primary navigation">
                            <ul className="flex items-center gap-1">
                                {primaryLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            aria-label={link.label}
                                            className="flex min-h-11 items-center rounded-control px-3 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white"
                                        >
                                            {link.shortLabel}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/search"
                                        aria-label="Search"
                                        className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-white/85 hover:bg-white/10 hover:text-white"
                                    >
                                        <LineIcon name="search" className="h-5 w-5" />
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <AccountMenu
                            tone="dark"
                            breakpoint="desktop"
                            onHiddenWhileFocused={focusMobileMenuTrigger}
                        />
                    </div>

                    <button
                        ref={menuTriggerRef}
                        type="button"
                        className="icon-button border border-white/25 text-white lg:hidden"
                        aria-label={menuOpen ? 'Close main menu' : 'Open main menu'}
                        aria-expanded={menuOpen}
                        aria-controls={menuId}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <LineIcon name={menuOpen ? 'x' : 'menu'} className="h-5 w-5" />
                    </button>
                </div>

                {menuOpen && (
                    <div
                        id={menuId}
                        className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-white/15 px-5 py-4 lg:hidden"
                    >
                        <nav aria-label="Primary navigation">
                            <ul className="mx-auto flex max-w-public flex-col gap-1">
                                {primaryLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="flex min-h-11 items-center rounded-control px-3 text-sm font-semibold text-white"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/search"
                                        className="flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-semibold text-white"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <LineIcon name="search" className="h-4 w-4" />
                                        Search
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="mx-auto mt-3 max-w-public border-t border-white/15 pt-4">
                            <AccountMenu
                                tone="dark"
                                breakpoint="mobile"
                                onHiddenWhileFocused={focusFirstDesktopDestination}
                            />
                        </div>
                    </div>
                )}
            </header>
            {children}
            <SiteFooter />
        </div>
    );
}
