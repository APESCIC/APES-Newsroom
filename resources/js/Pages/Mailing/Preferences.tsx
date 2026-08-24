import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AccountLayout from '../../Components/Layout/AccountLayout';

type ListState = { list: string; label: string; purpose: string; status: string | null };

export default function Preferences({
    email,
    lists,
    signed,
    status,
}: {
    email: string;
    lists: ListState[];
    signed: boolean;
    status?: string;
}) {
    const initial = lists.filter((l) => l.status === 'confirmed' || l.status === 'pending').map((l) => l.list);

    const { data, setData, post, processing, errors } = useForm<{ lists: string[] }>({
        lists: initial,
    });

    const toggleList = (value: string) => {
        setData(
            'lists',
            data.lists.includes(value) ? data.lists.filter((l) => l !== value) : [...data.lists, value],
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(signed ? window.location.pathname + window.location.search : '/account/mailing');
    };

    return (
        <>
            <Head title="Mailing preferences" />
            <AccountLayout
                title="Mailing preferences"
                description={`Manage lists for ${email}. New lists need email confirmation.`}
                backHref={signed ? undefined : '/account'}
                backLabel="← Account"
            >
                {status === 'preferences-updated' && (
                    <p className="status-badge-success mt-4">Preferences saved. Confirm any new lists via email.</p>
                )}

                <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                    <fieldset className="flex flex-col gap-3">
                        <legend className="text-sm font-bold text-body">Lists</legend>
                        {lists.map((list) => (
                            <label key={list.list} className="flex gap-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.lists.includes(list.list)}
                                    onChange={() => toggleList(list.list)}
                                />
                                <span>
                                    <span className="font-bold text-body">{list.label}</span>
                                    {list.status && (
                                        <span className="ml-2 text-xs text-muted">({list.status})</span>
                                    )}
                                    <span className="block text-muted">{list.purpose}</span>
                                </span>
                            </label>
                        ))}
                        {errors.lists && <p className="text-sm text-danger">{errors.lists}</p>}
                    </fieldset>
                    <button type="submit" disabled={processing} className="button-primary w-fit">
                        Save preferences
                    </button>
                </form>
            </AccountLayout>
        </>
    );
}
