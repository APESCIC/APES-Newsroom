import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthCard from '../../Components/Auth/AuthCard';

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
            <AuthCard title="Reset your password">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-body">Email</label>
                        <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className="form-input mt-1" />
                        {errors.email && <p className="text-sm text-danger">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-body">New password</label>
                        <input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required autoFocus className="form-input mt-1" />
                        {errors.password && <p className="text-sm text-danger">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="password_confirmation" className="text-sm font-bold text-body">Confirm new password</label>
                        <input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required className="form-input mt-1" />
                    </div>
                    <button type="submit" disabled={processing} className="button-primary">
                        Reset password
                    </button>
                </form>
            </AuthCard>
        </>
    );
}
