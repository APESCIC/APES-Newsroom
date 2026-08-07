import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, vi } from 'vitest';

type MockLinkProps = {
    as?: string;
    children?: ReactNode;
    href: string;
    method?: string;
    [key: string]: unknown;
};

vi.mock('@inertiajs/react', async () => {
    const React = await import('react');
    const { getInertiaMock } = await import('./inertia');

    return {
        Head: () => null,
        Link: (props: MockLinkProps) => {
            const { as = 'a', children, href, method, ...attributes } = props;
            void method;

            return React.createElement(as, as === 'a' ? { ...attributes, href } : attributes, children);
        },
        router: { post: (...args: unknown[]) => getInertiaMock().post(...args) },
        usePage: () => getInertiaMock().page,
    };
});

afterEach(() => {
    cleanup();
});
