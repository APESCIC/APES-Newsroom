import { Head } from '@inertiajs/react';
import AuthCard from '../../Components/Auth/AuthCard';

export default function MagicLinkSent() {
    return (
        <>
            <Head title="Check your email" />
            <AuthCard title="Check your email">
                <p className="text-muted">
                    If an account exists for that address, we&apos;ve sent a sign-in link. It expires in 15 minutes and can only be used
                    once.
                </p>
            </AuthCard>
        </>
    );
}
