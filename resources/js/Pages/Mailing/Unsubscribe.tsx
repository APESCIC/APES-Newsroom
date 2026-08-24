import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AccountLayout from '../../Components/Layout/AccountLayout';

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
            <AccountLayout
                title="Unsubscribe"
                description={`Update mailing preferences for ${email}. No login required.`}
            >
                <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                    <fieldset className="flex flex-col gap-3">
                        <legend className="text-sm font-bold text-body">Leave a specific list</legend>
                        {lists.map((list) => (
                            <label key={list.value} className="flex gap-3 text-sm text-body">
                                <input
                                    type="radio"
                                    name="list"
                                    checked={!data.all && data.list === list.value}
                                    onChange={() => setData({ list: list.value, all: false })}
                                />
                                {list.label}
                            </label>
                        ))}
                        <label className="flex gap-3 text-sm font-bold text-body">
                            <input
                                type="radio"
                                name="list"
                                checked={data.all}
                                onChange={() => setData({ list: '', all: true })}
                            />
                            Unsubscribe from all lists
                        </label>
                    </fieldset>
                    <button type="submit" disabled={processing} className="button-primary w-fit">
                        Confirm
                    </button>
                </form>
            </AccountLayout>
        </>
    );
}
