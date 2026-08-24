import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthCard from '../../Components/Auth/AuthCard';

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
            <AuthCard title="Email me a sign-in link">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-body">Email</label>
                        <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoFocus className="form-input mt-1" />
                        {errors.email && <p className="text-sm text-danger">{errors.email}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="button-primary">
                        Send link
                    </button>
                </form>
            </AuthCard>
        </>
    );
}
