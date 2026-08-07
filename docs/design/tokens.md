# APES Newsroom — Direction A design tokens

> **Status:** Approved with the complete Direction A mock-up set under issue
> #31 and implemented for homepage, admin moderation, and staff posts under #32.

## Brand direction

Story-led conservation editorial: credible, calm and mission-led on public
pages, with focused operational workspaces for staff and administrators. Use
the supplied APES artwork as-is. Do not redraw, recolour, grayscale or filter
the marks.

## Colour

| Token | Value | Usage |
| --- | --- | --- |
| `--color-brand-ink` | `#061A1A` | Public masthead and workspace rail |
| `--color-brand-teal` | `#00BFC7` | Decorative brand rules and highlights |
| `--color-teal-deep` | `#006E73` | Accessible links, buttons and active states |
| `--color-brand-mist` | `#E5F6F4` | Selected and informative surfaces |
| `--color-page-tint` | `#F4F8F7` | Application background |
| `--color-surface` | `#FFFFFF` | Cards and primary work surfaces |
| `--color-body` | `#17211F` | Primary text |
| `--color-muted` | `#5A6764` | Secondary text |
| `--color-border` | `#CAD8D4` | Separators and normal control borders |
| `--color-focus` | `#005FCC` | Visible focus rings |
| `--color-success` | `#176B45` | Approval and published states |
| `--color-warning` | `#9A5B13` | In-review and needs-attention states |
| `--color-danger` | `#A93030` | Rejection and destructive actions |
| `--color-apes-primary` | `#2D6A4F` | APES CIC channel |
| `--color-shelter-accent` | `#BC6C25` | Shelter & Rescue borders and decorative icons |
| `--color-clinic-accent` | `#457B9D` | Pet Care Clinic borders and decorative icons |
| `--color-shelter-text` | `#8A4B12` | Shelter & Rescue text and badges |
| `--color-clinic-text` | `#2F617D` | Pet Care Clinic text and badges |

Bright brand teal is decorative on light backgrounds; use deep teal for text
and controls. Never rely on channel or state colour without a text or icon
label. The text-specific Shelter token measures 5.76:1 on Shelter mist and
6.78:1 on white; the Clinic token measures 5.66:1 on Clinic mist and 6.72:1 on
white. These WCAG relative-luminance checks exceed the 4.5:1 AA requirement for
normal text, while the brighter accents remain available for non-text borders
and decorative icons.

## Typography

`Instrument Sans Variable` 5.3.0 is self-hosted through Fontsource with a
system sans-serif fallback; no remote font request is required. Display titles
use the supported 700 weight and compact line height. Body and UI text use
400–600 weight, with 16px primary reading text and 14px minimum compact
metadata. Article measure is 65–72 characters.

## Spacing, radius and elevation

- 4px base grid; primary gaps are 16, 24, 32 and 48px.
- Public maximum width: 1200px; workspace maximum width: 1440px; article
  measure: 720px.
- Controls use 10px radius, normal cards 14px and feature surfaces 18px.
- Normal cards use a one-pixel border and no shadow. Elevated feature cards
  and menus may use `0 12px 32px rgba(6, 26, 26, 0.10)`.
- Friendly Guide emoji and chunky offset shadows are retired in Direction A.

## Focus, targets and motion

- Visible 2px `--color-focus` outline with at least 2px offset.
- Minimum interactive target: 44×44px.
- Motion is limited to subtle opacity or translate transitions.
- Disable non-essential motion for `prefers-reduced-motion`.
- Maintain WCAG 2.2 AA contrast and reflow at 200% zoom.

## Page-shell mapping

- Public: dark brand masthead, light editorial content and a restrained legal
  footer.
- Staff/admin: dark workspace rail and light working canvas. Workspace links
  remain role-aware; the visual refresh does not broaden authorization.
