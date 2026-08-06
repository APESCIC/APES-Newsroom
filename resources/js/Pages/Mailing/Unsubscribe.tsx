import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type ListOption = { value: string; label: string };

export default function Unsubscribe({ email, lists }: { email: string; lists: ListOption[] }) {
    const { data, setData, post, processing } = useForm<{ list: string; all: boolean }>({
        list: '',
        all: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(window.location.pathname + window.location.search);
    };

    return (
        <>
            <Head title="Unsubscribe" />
            <main className="mx-auto max-w-lg px-6 py-12">
                <h1 className="text-2xl font-semibold">Unsubscribe</h1>
                <p className="mt-2 text-sm text-neutral-600">Update mailing preferences for {email}. No login required.</p>

                <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
                    <fieldset className="flex flex-col gap-3">
                        <legend className="font-medium">Leave a specific list</legend>
                        {lists.map((list) => (
                            <label key={list.value} className="flex gap-3 text-sm">
                                <input
                                    type="radio"
                                    name="list"
                                    checked={!data.all && data.list === list.value}
                                    onChange={() => setData({ list: list.value, all: false })}
                                />
                                {list.label}
                            </label>
                        ))}
                        <label className="flex gap-3 text-sm font-medium">
                            <input
                                type="radio"
                                name="list"
                                checked={data.all}
                                onChange={() => setData({ list: '', all: true })}
                            />
                            Unsubscribe from all lists
                        </label>
                    </fieldset>
                    <button type="submit" disabled={processing} className="w-fit rounded bg-apes-primary px-4 py-2 text-white">
                        Confirm
                    </button>
                </form>
            </main>
        </>
    );
}
