import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Components/Layout/PublicLayout';

export default function Rights() {
    return (
        <PublicLayout>
            <Head title="Your data rights" />
            <main id="main-content" className="prose prose-neutral mx-auto max-w-3xl px-6 py-12">
                <h1>Your data rights</h1>
                <ul>
                    <li>
                        <strong>Access / portability:</strong> signed-in users can download their data from{' '}
                        <Link href="/account/export">Account → Export</Link>.
                    </li>
                    <li>
                        <strong>Rectification:</strong> update your name and related details under{' '}
                        <Link href="/account">Account</Link>.
                    </li>
                    <li>
                        <strong>Erasure:</strong> delete your account from the account settings page.
                    </li>
                    <li>
                        <strong>Mailing consent:</strong> manage lists at <Link href="/account/mailing">Account → Mailing</Link>,
                        use signed preference links in emails, or <Link href="/mailing/unsubscribe">unsubscribe</Link>.
                    </li>
                </ul>
            </main>
        </PublicLayout>
    );
}
