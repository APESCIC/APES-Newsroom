import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Run = {
    id: number;
    status: string;
    dry_run: boolean;
    source_checksum: string | null;
    report: Record<string, unknown> | null;
    created_at: string | null;
    finished_at: string | null;
};

export default function GhostMembersImport({ runs }: { runs: Run[] }) {
    const { flash } = usePage().props as { flash?: { status?: string } };
    const form = useForm<{ csv: File | null; mode: string }>({
        csv: null,
        mode: 'dry-run',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post('/admin/imports/ghost-members', {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Ghost members import" />
            <main className="mx-auto max-w-3xl px-6 py-12">
                <h1 className="text-2xl font-semibold">Ghost members CSV import</h1>
                <p className="mt-2 text-sm text-neutral-600">
                    Upload a Ghost Admin members export. Imports create mailing contacts only (not accounts). All-three-list
                    activation is fail-closed without historic evidence labels. No email is sent from import runs.
                </p>
                {flash?.status && <p className="mt-4 text-sm text-green-700">{flash.status}</p>}

                <form onSubmit={submit} className="mt-8 flex flex-col gap-4 rounded border p-4">
                    <div>
                        <label htmlFor="csv" className="text-sm font-medium">
                            Members CSV
                        </label>
                        <input
                            id="csv"
                            type="file"
                            accept=".csv,text/csv"
                            required
                            onChange={(e) => form.setData('csv', e.target.files?.[0] ?? null)}
                            className="mt-1 block w-full text-sm"
                        />
                        {form.errors.csv && <p className="text-sm text-red-600">{form.errors.csv}</p>}
                    </div>
                    <fieldset className="flex gap-4 text-sm">
                        <label className="flex gap-2">
                            <input
                                type="radio"
                                name="mode"
                                checked={form.data.mode === 'dry-run'}
                                onChange={() => form.setData('mode', 'dry-run')}
                            />
                            Dry-run
                        </label>
                        <label className="flex gap-2">
                            <input
                                type="radio"
                                name="mode"
                                checked={form.data.mode === 'import'}
                                onChange={() => form.setData('mode', 'import')}
                            />
                            Import
                        </label>
                    </fieldset>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="w-fit rounded bg-apes-primary px-4 py-2 text-white"
                    >
                        Queue job
                    </button>
                </form>

                <section className="mt-10">
                    <h2 className="text-lg font-medium">Recent runs</h2>
                    <ul className="mt-4 space-y-3 text-sm">
                        {runs.map((run) => (
                            <li key={run.id} className="rounded border p-3">
                                <p>
                                    #{run.id} — {run.status} — {run.dry_run ? 'dry-run' : 'import'}
                                </p>
                                <p className="text-neutral-600">Checksum: {run.source_checksum}</p>
                                {run.report && (
                                    <pre className="mt-2 overflow-auto rounded bg-neutral-100 p-2 text-xs">
                                        {JSON.stringify(run.report, null, 2)}
                                    </pre>
                                )}
                                <button
                                    type="button"
                                    className="mt-2 underline"
                                    onClick={() => router.visit(`/admin/imports/ghost-members/${run.id}/report`)}
                                >
                                    Download report
                                </button>
                            </li>
                        ))}
                        {runs.length === 0 && <li className="text-neutral-600">No import runs yet.</li>}
                    </ul>
                </section>
            </main>
        </>
    );
}
