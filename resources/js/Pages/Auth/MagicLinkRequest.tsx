import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function MagicLinkRequest() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login/magic-link');
    };

    return (
        <>
            <Head title="Email me a sign-in link" />
            <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
                <h1 className="text-2xl font-semibold text-neutral-900">Email me a sign-in link</h1>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoFocus />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <button type="submit" disabled={processing}>
                        Send link
                    </button>
                </form>
            </main>
        </>
    );
}
