const EMAIL_LOCAL = 'info';
const EMAIL_DOMAIN = ['apes', 'org', 'uk'].join('.');

function publicEmail(): string {
    return `${EMAIL_LOCAL}@${EMAIL_DOMAIN}`;
}

export default function ProtectedEmail({ className }: { className?: string }) {
    const address = publicEmail();

    return (
        <a href={`mailto:${address}`} rel="nofollow" className={className}>
            {address}
        </a>
    );
}
