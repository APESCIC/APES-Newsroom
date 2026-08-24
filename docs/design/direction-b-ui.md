# Direction B UI — Magazine Bold Grid

Status: stakeholder-approved on 2026-08-24 under
[issue #36](https://github.com/APESCIC/APES-Newsroom/issues/36).
Implementation tracked under
[issue #53](https://github.com/APESCIC/APES-Newsroom/issues/53).

## Selected character

Direction B is a logo-led Magazine Bold Grid evolution of Direction A. Public
pages use asymmetric editorial grids, stronger headline hierarchy, and bold
channel colour blocks while remaining calm, credible, and newsroom-first.
Authenticated workspaces retain the same brand ink, teal and typography but
prioritise dense, calm task completion without asymmetric editorial layouts.

The supplied horizontal, square and compact APES logo files are the only brand
sources. Their artwork remains unchanged without filters or recolouring. No frog
mascot artwork is included in this direction.

Instrument Sans Variable 5.3.0 remains self-hosted from the application bundle.
Direction B uses supported weights 400–700; display headlines use 700 at larger
scale via the `.display-headline` component class.

## Page decisions

### Homepage

- Asymmetric 7/5 hero: bold featured story with `.editorial-rule` accent on the
  left; featured hero image or compact mission panel on the right.
- Three equal channel entry cards with full mist colour blocks and left accent
  stripes (APES CIC, Shelter & Rescue, Pet Care Clinic).
- Recent stories use an editorial grid with a lead card spanning two columns on
  desktop; hero images render when available with icon placeholder fallback.
- Public navigation and account actions remain source- and role-aware.

### Articles

- Stronger display headline scale and channel badge via `channelMeta`.
- Long-form reading measure stays ~720px with existing `.prose` styling.

### Channels, archives, search, legal

- Token migration from legacy `neutral-*` classes to Direction B tokens.
- Channel pages use a channel-coloured header block.

### Account and mailing

- New `AccountLayout` wraps personal settings under public chrome with a centred
  `.form-panel` card.
- Consent, privacy, and moderation status copy preserved.

### Authentication

- New `AuthCard` component with compact logo and token-based form styling.

### Admin moderation and staff editorial desk

- Shared workspace shell unchanged in information architecture.
- Minimal token alignment only; no asymmetric grids or display headlines.

## Accessibility and brand constraints

- Target WCAG 2.2 AA contrast.
- Visible focus intent and complete keyboard-operable navigation patterns.
- Maintain 44×44px minimum targets.
- Never use colour alone for channel, moderation, or publishing status.
- Respect `prefers-reduced-motion`.
- Preserve the supplied logo aspect ratios and artwork exactly.

## Out of scope

Application routes, permissions, moderation actions, mailing consent behaviour,
frog mascot artwork, logo modification, deployment, and production cutover are
not authorized by this design direction.
