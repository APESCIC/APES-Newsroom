import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import PostsIndex from '../Pages/Staff/Posts/Index';
import { setMockPage } from '../test/inertia';

describe('Direction A staff posts workspace', () => {
    beforeEach(() => {
        setMockPage({
            appName: 'APES Newsroom',
            auth: {
                user: { id: 1, name: 'Alex Editor', email: 'alex@example.test', role: 'admin' },
                can: { accessStaff: true, accessAdmin: true },
            },
        });
    });

    it('shows role-aware workspace navigation, filters, table and mobile cards', async () => {
        const user = userEvent.setup();
        render(
            <PostsIndex
                posts={[
                    {
                        id: 9,
                        title: 'Clinic advice for summer',
                        slug: 'clinic-advice-summer',
                        status: 'in_review',
                        channel: 'apes_pet_care_clinic',
                        updated_at: '2026-08-05T09:00:00Z',
                        author: 'Alex Editor',
                    },
                    {
                        id: 10,
                        title: 'Shelter adoption update',
                        slug: 'shelter-adoption-update',
                        status: 'published',
                        channel: 'apes_shelter_rescue',
                        updated_at: null,
                        author: 'Alex Editor',
                    },
                ]}
                filterStatus={null}
                canReview
            />,
        );

        expect(screen.getByRole('navigation', { name: 'Staff workspace' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Admin panel' })).toHaveAttribute('href', '/admin/moderation');
        expect(screen.getByRole('link', { name: 'Review queue' })).toHaveAttribute('href', '/staff/posts/review');
        expect(screen.getByRole('link', { name: 'New draft' })).toHaveAttribute('href', '/staff/posts/new');
        expect(screen.getByRole('navigation', { name: 'Post status filters' })).toBeInTheDocument();
        expect(screen.getByRole('table', { name: 'Newsroom posts' })).toBeInTheDocument();
        expect(screen.getByRole('list', { name: 'Newsroom posts on small screens' })).toBeInTheDocument();
        expect(screen.getAllByText('In review').length).toBeGreaterThan(1);
        expect(screen.getAllByText('Published').length).toBeGreaterThan(1);
        expect(screen.getAllByText('Pet Care Clinic').length).toBeGreaterThan(1);
        expect(screen.getByRole('link', { name: 'Edit Clinic advice for summer' })).toHaveAttribute(
            'href',
            '/staff/posts/9/edit',
        );

        const navigationButton = screen.getByRole('button', { name: 'Open workspace navigation' });
        await user.click(navigationButton);
        expect(navigationButton).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getAllByRole('navigation', { name: 'Staff workspace' })).toHaveLength(2);
        await user.keyboard('{Escape}');
        expect(navigationButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps admin and review navigation out of the staff-only workspace', () => {
        setMockPage({
            appName: 'APES Newsroom',
            auth: {
                user: { id: 2, name: 'Sam Staff', email: 'sam@example.test', role: 'staff' },
                can: { accessStaff: true, accessAdmin: false },
            },
        });

        render(<PostsIndex posts={[]} filterStatus={null} canReview={false} />);

        expect(screen.getByRole('navigation', { name: 'Staff workspace' })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Admin panel' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Review queue' })).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'New draft' })).toHaveAttribute('href', '/staff/posts/new');
    });
});
