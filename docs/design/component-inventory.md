# APES Newsroom — Component Inventory (draft)

> **Status:** Updated for Friendly Guide UI (#27). Baseline from #2; public chrome now follows
> [`docs/superpowers/specs/2026-08-06-friendly-guide-ui-design.md`](../superpowers/specs/2026-08-06-friendly-guide-ui-design.md).

## Layout

| Component | Description | States |
|-----------|-------------|--------|
| `PublicLayout` | Skip link, brand header, Search, AccountMenu, page tint, footer | guest, signed-in |
| `AccountMenu` | Login/Register or You disclosure with Profile / Admin / Staff / Sign out | guest, public, staff, admin |
| `SiteFooter` | Privacy, cookies, rights, mailing | default |
| `ChannelTrailTile` | Channel trail with icon, hint, accent border, chunky shadow | default, focus |
| `DeskPanel` | “On the desk” featured + recent stack | empty, with featured |
| `SiteHeader` | (legacy name) superseded by `PublicLayout` header | — |
| `SkipLink` | Skip to main content (in `PublicLayout`) | focus visible |
| `PageContainer` | Max-width wrapper with gutters | — |
| `ChannelHero` | Channel landing hero with accent | default |

## Content

| Component | Description | States |
|-----------|-------------|--------|
| `ArticleCard` | Image, title, excerpt, meta | default, featured |
| `ArticleList` | Grid/list of cards | loading, empty |
| `ArticleBody` | Rendered Editor.js blocks | — |
| `AuthorByline` | Name, date, channel | linked author |
| `TagPill` | Category/tag label | default, active |
| `Pagination` | Page navigation | disabled prev/next |

## Forms & auth

| Component | Description | States |
|-----------|-------------|--------|
| `TextInput` | Labelled input with error | default, error, disabled |
| `Button` | Primary/secondary/destructive | default, loading, disabled |
| `FormError` | Inline validation message | — |
| `AuthCard` | Centred auth form layout | — |

## Editorial (staff)

| Component | Description | States |
|-----------|-------------|--------|
| `EditorWorkspace` | Editor.js shell + sidebar | saving, conflict, read-only |
| `PostStatusBadge` | draft/in_review/scheduled/published | per status |
| `ReviewPanel` | Approve/reject with notes | admin only |
| `SeoFields` | Meta title, description, canonical | — |
| `SchedulePicker` | Europe/London datetime | GMT/BST aware |

## Engagement

| Component | Description | States |
|-----------|-------------|--------|
| `ReactionBar` | Helpful/Support/Thank You toggles | default, toggled, disabled |
| `CommentForm` | Plain text comment input | pending moderation notice |
| `CommentList` | Approved comments only | empty, loading |
| `ProfileCard` | Display name, avatar, bio | private, pending, approved |

## Email

| Component | Description | States |
|-----------|-------------|--------|
| `CampaignEmail` | Post-summary template | preview, test send |

## Feedback

| Component | Description | States |
|-----------|-------------|--------|
| `EmptyState` | No content message + CTA | per context |
| `ErrorPage` | Branded 404/410/429/500 | per status |
| `Toast` | Transient success/error | — |

## Tailwind mapping

Tokens from `tokens.md` map to Tailwind theme extensions in `resources/css/app.css`. Components use semantic class names rather than raw hex values.
