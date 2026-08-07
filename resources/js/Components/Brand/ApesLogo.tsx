type LogoVariant = 'horizontal' | 'square' | 'compact';

const logoFiles: Record<LogoVariant, { src: string; width: number; height: number }> = {
    horizontal: { src: '/brand/apes-logo-horizontal.png', width: 440, height: 250 },
    square: { src: '/brand/apes-logo-square.png', width: 1024, height: 1024 },
    compact: { src: '/brand/apes-logo-compact.png', width: 512, height: 512 },
};

export default function ApesLogo({
    variant,
    className = '',
    alt = 'APES Newsroom',
}: {
    variant: LogoVariant;
    className?: string;
    alt?: string;
}) {
    const logo = logoFiles[variant];

    return (
        <img
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt={alt}
            className={className}
            decoding="async"
        />
    );
}
