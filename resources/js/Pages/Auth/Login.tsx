import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
                <h1 className="text-2xl font-semibold text-neutral-900">Log in</h1>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoFocus />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>
                    <button type="submit" disabled={processing}>
                        Log in
                    </button>
                </form>
                <p className="flex flex-col gap-1 text-sm">
                    <Link href="/login/magic-link">Email me a sign-in link instead</Link>
                    <Link href="/forgot-password">Forgot your password?</Link>
                    <span>
                        Need an account? <Link href="/register">Register</Link>
                    </span>
                </p>
            </main>
        </>
    );
}
