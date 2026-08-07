import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import ModerationIndex from '../Pages/Admin/Moderation/Index';
import { getInertiaMock, setMockPage } from '../test/inertia';

describe('Direction A admin moderation workspace', () => {
    beforeEach(() => {
        setMockPage({
            appName: 'APES Newsroom',
            auth: {
                user: { id: 1, name: 'Alex Admin', email: 'alex@example.test', role: 'admin' },
                can: { accessStaff: true, accessAdmin: true },
            },
        });
    });

    it('summarises queues and switches between complete moderation views', async () => {
        const user = userEvent.setup();

        render(
            <ModerationIndex
                profiles={[{ id: 2, display_name: 'Sam Keeper', bio: 'Wildlife carer', user_name: 'sam', updated_at: null }]}
                comments={[
                    {
                        id: 3,
                        body: 'A thoughtful comment.',
                        user_name: 'reader',
                        post_title: 'Conservation update',
                        post_slug: 'conservation-update',
                        created_at: null,
                    },
                ]}
                reports={[{ id: 4, reason: 'Needs review', reportable_type: 'Comment', reportable_id: 3, reporter: 'member', created_at: null }]}
                suspended={[{ id: 5, display_name: 'Taylor', user_name: 'taylor', notes: 'Review requested' }]}
            />,
        );

        expect(screen.getByRole('img', { name: 'APES Newsroom' })).toHaveAttribute(
            'src',
            '/brand/apes-logo-compact.png',
        );
        expect(screen.getByRole('navigation', { name: 'Admin workspace' })).toBeInTheDocument();
        expect(screen.getByText('Profiles awaiting review')).toBeInTheDocument();
        expect(screen.getByText('Comments awaiting review')).toBeInTheDocument();
        expect(screen.getByText('Open reports')).toBeInTheDocument();
        expect(screen.getByText('Suspended profiles')).toBeInTheDocument();

        const tabs = screen.getByRole('tablist', { name: 'Moderation queues' });
        expect(tabs).toBeInTheDocument();

        screen.getByRole('tab', { name: /Profiles/ }).focus();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('tab', { name: /Comments/ })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('A thoughtful comment.')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Approve comment by reader' }));
        expect(getInertiaMock().post).toHaveBeenCalledWith('/admin/moderation/comments/3', { status: 'approved' });

        await user.click(screen.getByRole('tab', { name: /Reports/ }));
        expect(screen.getByText('Needs review')).toBeInTheDocument();

        await user.click(screen.getByRole('tab', { name: /Suspended/ }));
        expect(screen.getByRole('button', { name: 'Lift suspension for Taylor' })).toBeInTheDocument();
    });
});
