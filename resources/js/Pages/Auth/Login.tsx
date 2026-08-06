import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface LoginProps {
    staffLoginUrl: string | null;
    staffLoginLabel: string | null;
}

const DEV_ROLES = [
    { key: 'public', label: 'Public' },
    { key: 'staff', label: 'Staff' },
    { key: 'admin', label: 'Admin' },
    { key: 'super_admin', label: 'Super admin' },
] as const;

export default function Login({ staffLoginUrl, staffLoginLabel }: LoginProps) {
    const { devTools } = usePage<{ devTools?: boolean }>().props;
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
                {staffLoginUrl && (
                    <div className="flex flex-col gap-2">
                        <a
                            href={staffLoginUrl}
                            className="rounded border border-neutral-300 px-4 py-2 text-center text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                        >
                            {staffLoginLabel ?? 'Staff sign in'}
                        </a>
                        <p className="text-center text-xs text-neutral-500">or use a public account below</p>
                    </div>
                )}
                {devTools && (
                    <div className="flex flex-col gap-2 rounded border border-amber-300 bg-amber-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Local role preview</p>
                        <div className="flex flex-wrap gap-1.5">
                            {DEV_ROLES.map((role) => (
                                <button
                                    key={role.key}
                                    type="button"
                                    onClick={() => router.post(`/_dev/login/${role.key}`)}
                                    className="rounded border border-amber-700/30 bg-white px-2.5 py-1 text-xs font-medium text-amber-950 hover:bg-amber-100"
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
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
