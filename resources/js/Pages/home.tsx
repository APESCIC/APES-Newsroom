import { Head } from '@inertiajs/react';
import ApesLogo from '../Components/Brand/ApesLogo';
import ChannelTrailTile from '../Components/Home/ChannelTrailTile';
import DeskPanel, { type PostCard } from '../Components/Home/DeskPanel';
import RecentStoryCard from '../Components/Home/RecentStoryCard';
import PublicLayout from '../Components/Layout/PublicLayout';

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
        <PublicLayout>
            <Head title="Home" />
            <main id="main-content">
                <section className="border-b border-border bg-white">
                    <div className="mx-auto grid max-w-public items-center gap-12 px-5 py-12 sm:px-6 md:grid-cols-12 md:py-20">
                    <div className="md:col-span-7">
                        <DeskPanel featured={featured} />
                    </div>
                    <aside className="mx-auto w-full max-w-sm rounded-feature border border-border bg-page-tint p-8 md:col-span-5">
                        <ApesLogo
                            variant="square"
                            alt="Association of Protecting Exotic Species CIC"
                            className="h-auto w-full object-contain"
                        />
                        <div className="mt-8 border-t border-border pt-6 text-center">
                            <h2 className="text-sm font-bold text-body">Our mission</h2>
                            <p className="mt-2 text-xs leading-6 text-muted">
                                Securing a sustainable future for wildlife and communities through science, rescue, and compassionate care.
                            </p>
                        </div>
                    </aside>
                    </div>
                </section>

                <section className="py-12 sm:py-16" aria-label="APES newsroom channels">
                    <div className="mx-auto max-w-public px-5 sm:px-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            {channels.map((channel) => (
                                <ChannelTrailTile key={channel.slug} slug={channel.slug} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-t border-border bg-white py-12" aria-labelledby="recent-heading">
                    <div className="mx-auto max-w-public px-5 sm:px-6">
                    <h2 id="recent-heading" className="text-2xl font-bold text-body">Recent stories</h2>
                    {recent.length > 0 ? (
                        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {recent.map((post) => <RecentStoryCard key={post.slug} post={post} />)}
                        </div>
                    ) : (
                        <p className="mt-6 rounded-card border border-border bg-white p-6 text-muted">No additional stories are published yet.</p>
                    )}
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}
