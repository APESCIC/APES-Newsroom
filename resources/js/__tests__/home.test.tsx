import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import Home from '../Pages/home';
import { setMockPage } from '../test/inertia';

describe('Direction A public homepage', () => {
    beforeEach(() => {
        setMockPage({
            appName: 'APES Newsroom',
            auth: { user: null, can: { accessStaff: false, accessAdmin: false } },
        });
    });

    it('presents the approved brand-led news hierarchy and navigation', async () => {
        const user = userEvent.setup();
        render(
            <Home
                featured={{
                    title: 'Wildlife corridor project reaches a new milestone',
                    slug: 'wildlife-corridor-milestone',
                    excerpt: 'A practical update from the conservation team.',
                    channel: 'APES',
                    channel_slug: 'apes-cic',
                    author: 'Newsroom team',
                    published_at: '2026-08-05T09:00:00Z',
                }}
                recent={[
                    {
                        title: 'Shelter volunteers welcome new arrivals',
                        slug: 'shelter-new-arrivals',
                        excerpt: 'The latest from the rescue centre.',
                        channel: 'APES Shelter & Rescue',
                        channel_slug: 'apes-shelter-rescue',
                        author: 'Shelter team',
                        published_at: '2026-08-04T09:00:00Z',
                    },
                ]}
                channels={[
                    { slug: 'apes-cic', label: 'APES' },
                    { slug: 'apes-shelter-rescue', label: 'APES Shelter & Rescue' },
                    { slug: 'apes-pet-care-clinic', label: 'APES Pet Care Clinic' },
                ]}
            />,
        );

        expect(screen.getByRole('img', { name: 'APES Newsroom' })).toHaveAttribute(
            'src',
            '/brand/apes-logo-horizontal.png',
        );
        const primaryNavigation = screen.getByRole('navigation', { name: 'Primary navigation' });
        expect(within(primaryNavigation).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(within(primaryNavigation).getByRole('link', { name: 'APES Shelter & Rescue' })).toHaveAttribute(
            'href',
            '/apes-shelter-rescue',
        );
        expect(screen.getByRole('heading', { name: 'Wildlife corridor project reaches a new milestone' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Our mission' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'APES newsroom channels' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Recent stories' })).toBeInTheDocument();
        expect(screen.queryByText('Browse archive')).not.toBeInTheDocument();

        const menuButton = screen.getByRole('button', { name: 'Open main menu' });
        await user.click(menuButton);
        expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getAllByRole('navigation', { name: 'Primary navigation' })).toHaveLength(2);
        await user.keyboard('{Escape}');
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
});
