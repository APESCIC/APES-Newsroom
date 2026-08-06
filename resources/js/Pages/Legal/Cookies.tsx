import { Head } from '@inertiajs/react';
import PublicLayout from '../../Components/Layout/PublicLayout';

export default function Cookies() {
    return (
        <PublicLayout>
            <Head title="Cookie notice" />
            <main id="main-content" className="prose prose-neutral mx-auto max-w-3xl px-6 py-12">
                <h1>Cookie notice</h1>
                <p>
                    We use essential cookies and similar storage required to sign you in, protect forms (CSRF), and keep
                    sessions secure. These are strictly necessary for the service to work.
                </p>
                <p>
                    We do not use third-party advertising cookies on the newsroom. Analytics cookies, if introduced later,
                    will only load after an appropriate consent mechanism and updated notice.
                </p>
            </main>
        </PublicLayout>
    );
}
