import { Head, Link } from '@inertiajs/react';

type PostCard = {
    title: string;
    slug: string;
    excerpt: string | null;
    channel: string;
    channel_slug: string;
    author: string;
    published_at: string | null;
};

type Channel = { slug: string; label: string };

export default function Home({
    featured,
    recent,
    channels,
}: {
    featured?: PostCard;
    recent: PostCard[];
    channels: Channel[];
}) {
    return (
        <>
            <Head title="Home" />
            <a href="#main-content" className="sr-only focus:not-sr-only">
                Skip to main content
            </a>
            <header className="border-b border-neutral-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Link href="/" className="text-xl font-semibold text-apes-primary">
                        APES Newsroom
                    </Link>
                    <nav className="flex gap-4 text-sm">
                        {channels.map((c) => (
                            <Link key={c.slug} href={`/${c.slug}`} className="text-neutral-600 hover:text-neutral-900">
                                {c.label}
                            </Link>
                        ))}
                        <Link href="/search" className="text-neutral-600 hover:text-neutral-900">
                            Search
                        </Link>
                    </nav>
                </div>
            </header>

            <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
                <section className="mb-12">
                    <h1 className="text-4xl font-semibold text-neutral-900">Mission-led stories from APES</h1>
                    <p className="mt-3 max-w-2xl text-lg text-neutral-600">
                        News and updates from APES CIC, Shelter &amp; Rescue, and Pet Care Clinic.
                    </p>
                </section>

                {featured && (
                    <section className="mb-12">
                        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-neutral-600">Featured</h2>
                        <article className="rounded-lg border border-neutral-200 bg-white p-6">
                            <p className="text-sm text-apes-primary">{featured.channel}</p>
                            <h3 className="mt-2 text-2xl font-semibold">
                                <Link href={`/articles/${featured.slug}`}>{featured.title}</Link>
                            </h3>
                            {featured.excerpt && <p className="mt-2 text-neutral-600">{featured.excerpt}</p>}
                        </article>
                    </section>
                )}

                <section>
                    <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-neutral-600">Recent stories</h2>
                    {recent.length === 0 ? (
                        <p className="text-neutral-600">No published stories yet.</p>
                    ) : (
                        <ul className="grid gap-6 sm:grid-cols-2">
                            {recent.map((post) => (
                                <li key={post.slug} className="rounded-lg border border-neutral-200 bg-white p-5">
                                    <p className="text-sm text-neutral-600">{post.channel}</p>
                                    <h3 className="mt-1 text-lg font-semibold">
                                        <Link href={`/articles/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    {post.excerpt && <p className="mt-2 text-sm text-neutral-600">{post.excerpt}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
            <footer className="border-t border-neutral-200 py-8">
                <div className="mx-auto flex max-w-5xl flex-wrap gap-4 px-6 text-sm text-neutral-600">
                    <Link href="/legal/privacy">Privacy</Link>
                    <Link href="/legal/cookies">Cookies</Link>
                    <Link href="/legal/rights">Your rights</Link>
                    <Link href="/mailing/signup">Mailing lists</Link>
                </div>
            </footer>
        </>
    );
}
