import { type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import ApesLogo from '../Brand/ApesLogo';

type AuthCardProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

export default function AuthCard({ title, description, children }: AuthCardProps) {
    return (
        <div className="public-gradient-shell flex min-h-screen flex-col text-on-glass">
            <header className="glass-panel border-b border-white/10 px-5 py-4 sm:px-6">
                <Link href="/" className="inline-flex">
                    <ApesLogo variant="compact" className="h-10 w-auto object-contain" alt="APES Newsroom home" />
                </Link>
            </header>
            <main id="main-content" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12 sm:px-6">
                <div className="glass-form-panel">
                    <h1 className="text-2xl font-bold text-body">{title}</h1>
                    {description && <p className="mt-2 text-sm text-muted">{description}</p>}
                    <div className="mt-6">{children}</div>
                </div>
            </main>
        </div>
    );
}
