import { Head, Link } from '@inertiajs/react';

type Article = {
    title: string;
    slug: string;
    excerpt: string | null;
    html: string;
    channel: string;
    channel_slug: string;
    author: string;
    published_at: string | null;
    meta_title: string;
    meta_description: string | null;
    tags?: string[];
};

export default function ArticleShow({ article, preview }: { article: Article; preview?: boolean }) {
    return (
        <>
            <Head title={article.meta_title}>
                <meta name="description" content={article.meta_description ?? ''} />
                {preview && <meta name="robots" content="noindex,nofollow" />}
                <meta property="og:title" content={article.meta_title} />
                <meta property="og:description" content={article.meta_description ?? ''} />
                <meta property="og:type" content="article" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: article.title,
                        author: { '@type': 'Person', name: article.author },
                        datePublished: article.published_at,
                    })}
                </script>
            </Head>
            {preview && (
                <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">Preview — not indexed</div>
            )}
            <main className="mx-auto max-w-3xl px-6 py-12">
                <Link href={`/${article.channel_slug}`} className="text-sm text-apes-primary">
                    {article.channel}
                </Link>
                <article>
                    <h1 className="mt-4 text-4xl font-semibold text-neutral-900">{article.title}</h1>
                    <p className="mt-2 text-sm text-neutral-600">
                        By {article.author}
                        {article.published_at && (
                            <> · {new Date(article.published_at).toLocaleDateString('en-GB')}</>
                        )}
                    </p>
                    <div
                        className="prose prose-neutral mt-8 max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.html }}
                    />
                </article>
            </main>
        </>
    );
}
