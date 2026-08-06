import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import PublicLayout from '../../Components/Layout/PublicLayout';

type Result = { title: string; slug: string; excerpt: string | null; published_at: string | null };

export default function SearchIndex({ query, results }: { query: string; results: Result[] }) {
    const { data, setData, get } = useForm({ q: query });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        get('/search', { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Search" />
            <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
                <h1 className="text-2xl font-semibold">Search</h1>
                <form onSubmit={submit} className="mt-4 flex gap-2">
                    <label htmlFor="q" className="sr-only">
                        Search
                    </label>
                    <input
                        id="q"
                        value={data.q}
                        onChange={(e) => setData('q', e.target.value)}
                        className="flex-1 rounded border border-neutral-300 px-3 py-2"
                        placeholder="Search articles…"
                    />
                    <button type="submit" className="rounded bg-apes-primary px-4 py-2 text-white">
                        Search
                    </button>
                </form>
                <ul className="mt-8 space-y-4">
                    {results.map((r) => (
                        <li key={r.slug}>
                            <Link href={`/articles/${r.slug}`} className="text-lg font-medium hover:underline">
                                {r.title}
                            </Link>
                            {r.excerpt && <p className="text-sm text-neutral-600">{r.excerpt}</p>}
                        </li>
                    ))}
                </ul>
            </main>
        </PublicLayout>
    );
}
