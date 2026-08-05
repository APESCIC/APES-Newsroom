import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    email: string;
    token: string;
}

export default function ResetPassword({ email, token }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset password" />
            <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
                <h1 className="text-2xl font-semibold text-neutral-900">Reset your password</h1>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">New password</label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoFocus
                        />
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="password_confirmation">Confirm new password</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={processing}>
                        Reset password
                    </button>
                </form>
            </main>
        </>
    );
}
