import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    const { status } = usePage<{ status?: string }>().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <>
            <Head title="Forgot password" />
            <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
                <h1 className="text-2xl font-semibold text-neutral-900">Forgot your password?</h1>
                {status && <p className="text-sm text-green-700">{status}</p>}
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoFocus />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <button type="submit" disabled={processing}>
                        Email password reset link
                    </button>
                </form>
            </main>
        </>
    );
}
