import { Link, usePage } from '@inertiajs/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { SharedPageProps } from '../../types/page';

export default function AccountMenu() {
    const { auth } = usePage<SharedPageProps>().props;
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        const onClick = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onClick);

        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onClick);
        };
    }, [open]);

    if (!auth.user) {
        return (
            <div className="flex items-center gap-3 text-sm">
                <Link href="/login" className="text-neutral-600 hover:text-neutral-900">
                    Login
                </Link>
                <Link
                    href="/register"
                    className="rounded-lg border border-apes-primary bg-white px-3 py-2 font-semibold text-apes-primary"
                >
                    Register
                </Link>
            </div>
        );
    }

    return (
        <div className="relative" ref={rootRef}>
            <button
                type="button"
                className="min-h-11 rounded-lg border border-apes-primary bg-[#e8f2ec] px-3 py-2 text-sm font-bold text-[#1b4332]"
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((v) => !v)}
            >
                You ▾
            </button>
            {open && (
                <div
                    id={menuId}
                    role="menu"
                    className="absolute right-0 z-20 mt-2 min-w-[10rem] rounded-xl border-2 border-neutral-900 bg-white py-1 shadow-chunky-ink"
                >
                    <Link
                        href="/account"
                        role="menuitem"
                        className="block px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
                        onClick={() => setOpen(false)}
                    >
                        Profile
                    </Link>
                    {auth.can.accessAdmin && (
                        <Link
                            href="/admin/moderation"
                            role="menuitem"
                            className="block bg-[#e8f2ec] px-3 py-2 text-sm font-bold text-[#1b4332] hover:bg-[#d8e8df]"
                            onClick={() => setOpen(false)}
                        >
                            Admin panel
                        </Link>
                    )}
                    {auth.can.accessStaff && (
                        <Link
                            href="/staff/posts"
                            role="menuitem"
                            className="block px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
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
                        className="block w-full px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100"
                        onClick={() => setOpen(false)}
                    >
                        Sign out
                    </Link>
                </div>
            )}
        </div>
    );
}
