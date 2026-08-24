import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formatStoryDate } from '../Components/Home/DeskPanel';
import Home from '../Pages/home';
import { setMockPage } from '../test/inertia';
import appCss from '../../css/app.css?raw';
import protectedEmailSource from '../Components/Layout/ProtectedEmail.tsx?raw';

describe('Direction B public homepage', () => {
    let desktopMatches: boolean;
    let desktopChangeListeners: Set<(event: MediaQueryListEvent) => void>;

    const dispatchDesktopChange = (matches: boolean) => {
        desktopMatches = matches;
        const event = { matches } as MediaQueryListEvent;
        for (const listener of desktopChangeListeners) listener(event);
    };

    beforeEach(() => {
        desktopMatches = true;
        desktopChangeListeners = new Set();
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                get matches() {
                    return desktopMatches;
                },
                media: query,
                onchange: null,
                addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
                    desktopChangeListeners.add(listener);
                },
                removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
                    desktopChangeListeners.delete(listener);
                },
                addListener: vi.fn(),
                removeListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
        setMockPage({
            appName: 'APES Newsroom',
            auth: {
                user: { id: 1, name: 'Alex Editor', email: 'alex@example.test', role: 'admin' },
                can: { accessStaff: true, accessAdmin: true },
            },
        });
    });

    it('presents the approved brand-led news hierarchy and navigation', async () => {
        const user = userEvent.setup();
        try {
            vi.stubEnv('TZ', 'America/Los_Angeles');
            expect(formatStoryDate('2026-08-07T00:30:00Z')).toBe('7 August 2026');
        } finally {
            vi.unstubAllEnvs();
        }

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
            '/brand/apes-logo-masthead.png',
        );
        const primaryNavigation = screen.getByRole('navigation', { name: 'Primary navigation' });
        expect(within(primaryNavigation).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(within(primaryNavigation).getByRole('link', { name: 'APES Shelter & Rescue' })).toHaveAttribute(
            'href',
            '/apes-shelter-rescue',
        );
        expect(screen.getByRole('heading', { name: 'Wildlife corridor project reaches a new milestone' })).toHaveClass('display-headline');
        expect(document.querySelector('.editorial-rule')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /^APES CIC/ })).toHaveClass('channel-block');
        expect(
            screen.getByRole('link', {
                name: 'Read the story: Wildlife corridor project reaches a new milestone',
            }),
        ).toHaveTextContent('Read the story');
        expect(screen.getByRole('heading', { name: 'Our mission' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'APES newsroom channels' })).toBeInTheDocument();
        const apesChannel = screen.getByRole('link', { name: /^APES CIC/ });
        expect(apesChannel).not.toHaveAttribute('aria-label');
        expect(apesChannel).toHaveTextContent('APES CIC');
        expect(screen.getByRole('link', { name: /^Shelter & Rescue/ })).toHaveTextContent('Shelter & Rescue');
        expect(screen.getByRole('link', { name: /^Pet Care Clinic/ })).toHaveTextContent('Pet Care Clinic');
        expect(screen.getByRole('heading', { name: 'Recent stories' })).toBeInTheDocument();
        expect(screen.getByText('The latest from the rescue centre.')).toBeInTheDocument();
        expect(screen.getByText('4 August 2026', { selector: 'time' })).toHaveAttribute(
            'datetime',
            '2026-08-04T09:00:00Z',
        );
        expect(screen.queryByText('Browse archive')).not.toBeInTheDocument();

        const squareLogo = screen.getByRole('img', { name: 'Association for the Protection of Exotic Species' });
        expect(squareLogo).toHaveAttribute('src', '/brand/apes-logo-square.png');
        expect(squareLogo.parentElement?.tagName).toBe('PICTURE');
        const responsiveSource = squareLogo.parentElement?.querySelector('source[type="image/webp"]');
        expect(responsiveSource).toHaveAttribute(
            'srcset',
            '/brand/apes-logo-square-384.webp 384w, /brand/apes-logo-square-768.webp 768w',
        );
        expect(responsiveSource).toHaveAttribute('sizes', '(min-width: 768px) 384px, calc(100vw - 6.5rem)');

        const footerLogo = screen.getByRole('link', { name: 'APES Newsroom home' }).querySelector('img');
        expect(footerLogo).toHaveAttribute('src', '/brand/apes-logo-footer-64.png');

        const menuButton = screen.getByRole('button', { name: 'Open main menu' });
        const desktopHomeLink = within(primaryNavigation).getByRole('link', { name: 'Home' });
        desktopHomeLink.focus();
        act(() => dispatchDesktopChange(false));
        expect(menuButton).toHaveFocus();
        act(() => dispatchDesktopChange(true));
        expect(desktopHomeLink).toHaveFocus();

        const desktopAccountButton = within(primaryNavigation.parentElement!).getByRole('button', { name: 'Account' });
        await user.click(desktopAccountButton);
        expect(desktopAccountButton).toHaveAttribute('aria-expanded', 'true');
        act(() => dispatchDesktopChange(false));
        expect(desktopAccountButton).toHaveAttribute('aria-expanded', 'false');
        expect(menuButton).toHaveFocus();

        await user.click(menuButton);
        expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        const mobileMenu = document.getElementById(menuButton.getAttribute('aria-controls') ?? '');
        expect(mobileMenu).toHaveClass('max-h-[calc(100dvh-4rem)]', 'overflow-y-auto');
        expect(screen.getAllByRole('navigation', { name: 'Primary navigation' })).toHaveLength(2);
        const mobileNavigation = screen.getAllByRole('navigation', { name: 'Primary navigation' })[1];
        within(mobileNavigation).getByRole('link', { name: 'APES' }).focus();
        await user.keyboard('{Escape}');
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        expect(menuButton).toHaveFocus();

        await user.click(menuButton);
        const accountButton = within(document.getElementById(menuButton.getAttribute('aria-controls') ?? '')!).getByRole(
            'button',
            { name: 'Account' },
        );
        await user.click(accountButton);
        expect(accountButton).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{Escape}');
        expect(accountButton).toHaveAttribute('aria-expanded', 'false');
        expect(accountButton).toHaveFocus();
        expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        await user.keyboard('{Escape}');
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        expect(menuButton).toHaveFocus();

        await user.click(menuButton);
        const reopenedMobileNavigation = screen.getAllByRole('navigation', { name: 'Primary navigation' })[1];
        within(reopenedMobileNavigation).getByRole('link', { name: 'APES' }).focus();
        act(() => dispatchDesktopChange(true));
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        expect(within(primaryNavigation).getByRole('link', { name: 'Home' })).toHaveFocus();

        act(() => dispatchDesktopChange(false));
        await user.click(menuButton);
        const mastheadHomeLink = screen.getAllByRole('link', { name: 'APES Newsroom' })[0];
        mastheadHomeLink.focus();
        act(() => dispatchDesktopChange(true));
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        expect(mastheadHomeLink).toHaveFocus();

        expect(appCss).not.toContain('min-width: 20rem');
        const footerNavigation = screen.getByRole('navigation', { name: 'Legal and subscriptions' });
        for (const link of within(footerNavigation).getAllByRole('link')) {
            expect(link).toHaveClass('inline-flex', 'min-h-11', 'min-w-11', 'items-center', 'justify-center');
        }

        const footer = screen.getByRole('contentinfo');
        expect(footer).toHaveTextContent('40 Morris Street, St Helens, Merseyside, WA9 3EN');
        expect(within(footer).getByRole('link', { name: '01744 374 015' })).toHaveAttribute('href', 'tel:+441744374015');

        const assembledEmail = ['info', '@', ['apes', 'org', 'uk'].join('.')].join('');
        const emailLink = within(footer).getByRole('link', { name: assembledEmail });
        expect(emailLink).toHaveAttribute('href', `mailto:${assembledEmail}`);
        expect(emailLink).toHaveAttribute('rel', 'nofollow');
        expect(protectedEmailSource).not.toContain(assembledEmail);
    });
});
