import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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
            <main className="mx-auto max-w-lg px-6 py-12">
                <h1 className="text-2xl font-semibold">Mailing preferences</h1>
                <p className="mt-2 text-sm text-neutral-600">Manage lists for {email}. New lists need email confirmation.</p>

                {status === 'preferences-updated' && (
                    <p className="mt-4 text-sm text-green-700">Preferences saved. Confirm any new lists via email.</p>
                )}

                <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
                    <fieldset className="flex flex-col gap-3">
                        <legend className="font-medium">Lists</legend>
                        {lists.map((list) => (
                            <label key={list.list} className="flex gap-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.lists.includes(list.list)}
                                    onChange={() => toggleList(list.list)}
                                />
                                <span>
                                    <span className="font-medium">{list.label}</span>
                                    {list.status && (
                                        <span className="ml-2 text-xs text-neutral-500">({list.status})</span>
                                    )}
                                    <span className="block text-neutral-600">{list.purpose}</span>
                                </span>
                            </label>
                        ))}
                        {errors.lists && <p className="text-sm text-red-600">{errors.lists}</p>}
                    </fieldset>
                    <button type="submit" disabled={processing} className="w-fit rounded bg-apes-primary px-4 py-2 text-white">
                        Save preferences
                    </button>
                </form>
            </main>
        </>
    );
}
