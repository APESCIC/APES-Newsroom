import { Head } from '@inertiajs/react';
import ChannelTrailTile from '../Components/Home/ChannelTrailTile';
import DeskPanel, { type PostCard } from '../Components/Home/DeskPanel';
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
            <main id="main-content" className="mx-auto max-w-5xl px-6 py-10">
                <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
                    <div className="order-2 flex flex-col gap-3 md:order-1">
                        {channels.map((channel) => (
                            <ChannelTrailTile key={channel.slug} slug={channel.slug} label={channel.label} />
                        ))}
                    </div>
                    <div className="order-1 md:order-2">
                        <DeskPanel featured={featured} recent={recent} />
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
