# APES Newsroom — Design Tokens (draft)

> **Status:** First-pass draft for stakeholder review (#2).

## Brand direction

Mission-led editorial: authentic animal-care imagery, warm APES accents, high-contrast long-form reading, calm accessible interfaces. Three channels share a unified system with distinct accent colours.

## Colour

| Token | Value | Usage |
|-------|-------|-------|
| `--color-apes-primary` | `#2D6A4F` | Primary actions, APES CIC accent |
| `--color-shelter-accent` | `#BC6C25` | Shelter & Rescue channel |
| `--color-clinic-accent` | `#457B9D` | Pet Care Clinic channel |
| `--color-neutral-900` | `#1A1A1A` | Headings, body text |
| `--color-neutral-600` | `#525252` | Secondary text |
| `--color-neutral-100` | `#F5F5F4` | Page backgrounds |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-error` | `#B91C1C` | Errors, destructive actions |
| `--color-success` | `#15803D` | Success states |
| `--color-focus` | `#2563EB` | Focus rings |

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | Instrument Sans, system-ui | UI and body |
| `--font-serif` | Georgia, serif | Article long-form (optional) |
| `--text-xs` | 0.75rem / 1rem | Captions, metadata |
| `--text-sm` | 0.875rem / 1.25rem | Secondary UI |
| `--text-base` | 1rem / 1.5rem | Body |
| `--text-lg` | 1.125rem / 1.75rem | Lead paragraphs |
| `--text-xl` | 1.25rem / 1.75rem | Section headings |
| `--text-2xl` | 1.5rem / 2rem | Page titles |
| `--text-3xl` | 1.875rem / 2.25rem | Article titles (mobile) |
| `--text-4xl` | 2.25rem / 2.5rem | Article titles (desktop) |

## Spacing

4px base grid: `--space-1` (4px) through `--space-16` (64px). Article content max-width: `42rem` (prose). Page gutters: `1.5rem` mobile, `2rem` tablet+.

## Focus

- Visible 2px `--color-focus` outline with 2px offset
- Never remove focus indicators
- Focus must not be obscured by sticky headers

## Touch targets

Minimum 44×44px for interactive elements (WCAG 2.2 target size).

## Motion

Respect `prefers-reduced-motion`: disable non-essential transitions when set.

## Channel differentiation

Each channel page uses its accent colour for:
- Hero band background tint
- Category pill borders
- Section heading underlines

Shared chrome (header, footer, article body) remains consistent across channels.
