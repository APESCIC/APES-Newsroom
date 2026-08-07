import { Link, usePage } from '@inertiajs/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { SharedPageProps } from '../../types/page';

type AccountMenuBreakpoint = 'all' | 'desktop' | 'mobile';

export default function AccountMenu({
    tone = 'light',
    breakpoint = 'all',
    onHiddenWhileFocused,
}: {
    tone?: 'light' | 'dark';
    breakpoint?: AccountMenuBreakpoint;
    onHiddenWhileFocused?: () => void;
}) {
    const { auth } = usePage<SharedPageProps>().props;
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (breakpoint === 'all' || typeof window.matchMedia !== 'function') return;

        const desktopQuery = window.matchMedia('(min-width: 64rem)');
        const closeWhenHidden = ({ matches }: Pick<MediaQueryListEvent, 'matches'>) => {
            const visible = breakpoint === 'desktop' ? matches : !matches;
            if (!visible) {
                const presentationHadFocus = rootRef.current?.contains(document.activeElement) ?? false;
                setOpen(false);
                if (presentationHadFocus) onHiddenWhileFocused?.();
            }
        };

        closeWhenHidden(desktopQuery);
        desktopQuery.addEventListener('change', closeWhenHidden);
        return () => desktopQuery.removeEventListener('change', closeWhenHidden);
    }, [breakpoint, onHiddenWhileFocused]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopImmediatePropagation();
                setOpen(false);
                triggerRef.current?.focus();
            }
        };
        const onClick = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', onKey, true);
        document.addEventListener('mousedown', onClick);

        return () => {
            document.removeEventListener('keydown', onKey, true);
            document.removeEventListener('mousedown', onClick);
        };
    }, [open]);

    if (!auth.user) {
        return (
            <div className="flex items-center gap-3 text-sm">
                <Link
                    href="/login"
                    className={`flex min-h-11 items-center px-1 font-semibold ${tone === 'dark' ? 'text-white/85 hover:text-white' : 'text-muted hover:text-body'}`}
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className={`flex min-h-11 items-center rounded-control border px-4 py-2 font-semibold ${
                        tone === 'dark'
                            ? 'border-brand-teal bg-brand-teal text-brand-ink'
                            : 'border-teal-deep bg-teal-deep text-white'
                    }`}
                >
                    Register
                </Link>
            </div>
        );
    }

    return (
        <div className="relative" ref={rootRef}>
            <button
                ref={triggerRef}
                type="button"
                className={`min-h-11 rounded-control border px-3 py-2 text-sm font-semibold ${
                    tone === 'dark'
                        ? 'border-white/30 bg-white/10 text-white'
                        : 'border-border bg-white text-brand-ink'
                }`}
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((v) => !v)}
            >
                Account
            </button>
            {open && (
                <div
                    id={menuId}
                    role="menu"
                    className="absolute right-0 z-20 mt-2 min-w-44 rounded-card border border-border bg-white py-2 text-body shadow-elevated"
                >
                    <Link
                        href="/account"
                        role="menuitem"
                        className="block min-h-11 px-4 py-3 text-sm text-muted hover:bg-brand-mist hover:text-body"
                        onClick={() => setOpen(false)}
                    >
                        Profile
                    </Link>
                    {auth.can.accessAdmin && (
                        <Link
                            href="/admin/moderation"
                            role="menuitem"
                            className="block min-h-11 px-4 py-3 text-sm font-semibold text-brand-ink hover:bg-brand-mist"
                            onClick={() => setOpen(false)}
                        >
                            Admin panel
                        </Link>
                    )}
                    {auth.can.accessStaff && (
                        <Link
                            href="/staff/posts"
                            role="menuitem"
                            className="block min-h-11 px-4 py-3 text-sm text-muted hover:bg-brand-mist hover:text-body"
                            onClick={() => setOpen(false)}
                        >
                            Staff desk
                        </Link>
                    )}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        role="menuitem"
                        className="block min-h-11 w-full px-4 py-3 text-left text-sm text-muted hover:bg-brand-mist hover:text-body"
                        onClick={() => setOpen(false)}
                    >
                        Sign out
                    </Link>
                </div>
            )}
        </div>
    );
}
