import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type ListOption = { value: string; label: string; purpose: string };

export default function Signup({ lists, status }: { lists: ListOption[]; status?: string }) {
    const { data, setData, post, processing, errors } = useForm<{ email: string; lists: string[] }>({
        email: '',
        lists: [],
    });

    const toggleList = (value: string) => {
        setData(
            'lists',
            data.lists.includes(value) ? data.lists.filter((l) => l !== value) : [...data.lists, value],
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/mailing/signup');
    };

    return (
        <>
            <Head title="Mailing lists" />
            <main className="mx-auto max-w-lg px-6 py-12">
                <h1 className="text-2xl font-semibold">APES Newsroom mailing lists</h1>
                <p className="mt-2 text-sm text-neutral-600">
                    Choose which APES lists you want. Nothing is pre-selected. We will email you a confirmation
                    link for each list before sending any news.
                </p>

                {status === 'check-email' && (
                    <p className="mt-4 text-sm text-green-700">Check your email to confirm each list you selected.</p>
                )}

                <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
                    <div>
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <fieldset className="flex flex-col gap-3">
                        <legend className="font-medium">Lists</legend>
                        {lists.map((list) => (
                            <label key={list.value} className="flex gap-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.lists.includes(list.value)}
                                    onChange={() => toggleList(list.value)}
                                />
                                <span>
                                    <span className="font-medium">{list.label}</span>
                                    <span className="block text-neutral-600">{list.purpose}</span>
                                </span>
                            </label>
                        ))}
                        {errors.lists && <p className="text-sm text-red-600">{errors.lists}</p>}
                    </fieldset>

                    <button type="submit" disabled={processing} className="w-fit rounded bg-apes-primary px-4 py-2 text-white">
                        Subscribe
                    </button>
                </form>
            </main>
        </>
    );
}
