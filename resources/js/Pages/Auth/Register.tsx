import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthCard from '../../Components/Auth/AuthCard';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <AuthCard title="Create an account">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-bold text-body">Name</label>
                        <input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoFocus className="form-input mt-1" />
                        {errors.name && <p className="text-sm text-danger">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-body">Email</label>
                        <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className="form-input mt-1" />
                        {errors.email && <p className="text-sm text-danger">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-body">Password</label>
                        <input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required className="form-input mt-1" />
                        {errors.password && <p className="text-sm text-danger">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="password_confirmation" className="text-sm font-bold text-body">Confirm password</label>
                        <input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required className="form-input mt-1" />
                    </div>
                    <button type="submit" disabled={processing} className="button-primary">
                        Register
                    </button>
                </form>
                <p className="mt-6 text-sm text-muted">
                    Already have an account? <Link href="/login" className="text-teal-deep hover:underline">Log in</Link>
                </p>
            </AuthCard>
        </>
    );
}
