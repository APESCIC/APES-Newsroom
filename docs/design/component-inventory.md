# APES Newsroom — Component Inventory (draft)

> **Status:** First-pass draft for stakeholder review (#2).

## Layout

| Component | Description | States |
|-----------|-------------|--------|
| `SiteHeader` | Logo, primary nav, search, account | default, mobile menu open |
| `SiteFooter` | Links, charity info, privacy | default |
| `SkipLink` | Skip to main content | focus visible |
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
