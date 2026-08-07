import { vi } from 'vitest';
import type { SharedPageProps } from '../types/page';

const inertiaMock = {
    page: {
        props: {
            appName: 'APES Newsroom',
            auth: {
                user: null,
                can: { accessStaff: false, accessAdmin: false },
            },
        } as SharedPageProps,
    },
    post: vi.fn(),
};

export function setMockPage(props: SharedPageProps) {
    inertiaMock.page = { props };
    inertiaMock.post.mockReset();
}

export function getInertiaMock() {
    return inertiaMock;
}
