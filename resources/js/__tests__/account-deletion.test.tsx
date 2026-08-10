import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Profile from '../Pages/Account/Profile';

const publicUser = {
    name: 'Public Reader',
    email: 'reader@example.test',
    role: 'public',
    auth_provider: 'password',
};

describe('account self-service deletion', () => {
    it('shows the action only when the server marks the account eligible', () => {
        const { rerender } = render(
            <Profile user={publicUser} can_delete_account deletion_block_reason={null} />,
        );

        expect(screen.getByRole('button', { name: 'Delete account' })).toBeInTheDocument();

        rerender(
            <Profile
                user={{ ...publicUser, role: 'staff', auth_provider: 'cloudron_oidc' }}
                can_delete_account={false}
                deletion_block_reason="Staff accounts require an administrator-led process."
            />,
        );

        expect(screen.queryByRole('button', { name: 'Delete account' })).not.toBeInTheDocument();
        expect(screen.getByText('Staff accounts require an administrator-led process.')).toBeInTheDocument();
    });
});
