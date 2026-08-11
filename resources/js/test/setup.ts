import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, vi } from 'vitest';
import { getInertiaMock as getTestInertiaMock } from './inertia';

type MockLinkProps = {
    as?: string;
    children?: ReactNode;
    href: string;
    method?: string;
    [key: string]: unknown;
};

type MockHeadProps = {
    children?: ReactNode;
    [key: string]: unknown;
};

vi.mock('@inertiajs/react', async () => {
    const React = await import('react');
    const { getInertiaMock } = await import('./inertia');

    return {
        Head: ({ children }: MockHeadProps) => React.createElement(React.Fragment, null, children),
        Link: (props: MockLinkProps) => {
            const { as = 'a', children, href, method, ...attributes } = props;
            void method;

            return React.createElement(as, as === 'a' ? { ...attributes, href } : attributes, children);
        },
        router: {
            post: (...args: unknown[]) => getInertiaMock().post(...args),
            patch: (...args: unknown[]) => getInertiaMock().patch(...args),
            delete: (...args: unknown[]) => getInertiaMock().delete(...args),
        },
        useForm: <T extends Record<string, unknown>>(initial: T) => {
            const [data, setFormData] = React.useState(initial);
            const [defaultData, setDefaultData] = React.useState(initial);
            const transformRef = React.useRef<(values: T) => unknown>((values) => values);
            const setData = React.useCallback((
                keyOrData: keyof T | Partial<T> | ((current: T) => T),
                value?: T[keyof T],
            ) => {
                if (typeof keyOrData === 'function') {
                    setFormData(keyOrData);
                    return;
                }
                if (typeof keyOrData === 'object') {
                    setFormData((current) => ({ ...current, ...keyOrData }));
                    return;
                }
                setFormData((current) => ({ ...current, [keyOrData]: value }));
            }, []);
            const post = React.useCallback(
                (...args: unknown[]) => getInertiaMock().post(...args, transformRef.current(data)),
                [data],
            );
            const patch = React.useCallback(
                (...args: unknown[]) => getInertiaMock().patch(...args, transformRef.current(data)),
                [data],
            );
            const destroy = React.useCallback(
                (...args: unknown[]) => getInertiaMock().delete(...args, transformRef.current(data)),
                [data],
            );
            const transform = React.useCallback((callback: (values: T) => unknown) => {
                transformRef.current = callback;
            }, []);
            const setDefaults = React.useCallback((values: T) => setDefaultData(values), []);
            const reset = React.useCallback((...fields: (keyof T)[]) => {
                if (fields.length === 0) {
                    setFormData(defaultData);
                    return;
                }

                setFormData((current) => {
                    const restored = { ...current };
                    fields.forEach((field) => {
                        restored[field] = defaultData[field];
                    });

                    return restored;
                });
            }, [defaultData]);

            return {
                data,
                setData,
                post,
                patch,
                delete: destroy,
                processing: false,
                errors: {},
                transform,
                setDefaults,
                isDirty: JSON.stringify(data) !== JSON.stringify(defaultData),
                reset,
            };
        },
        usePage: () => getInertiaMock().page,
    };
});

afterEach(() => {
    cleanup();
    const inertiaMock = getTestInertiaMock();
    inertiaMock.post.mockReset();
    inertiaMock.patch.mockReset();
    inertiaMock.delete.mockReset();
});
