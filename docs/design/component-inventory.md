# APES Newsroom — Component inventory

> **Status:** Direction A approved under #31. Homepage, admin moderation, and
> staff posts components are implemented under #32; remaining rows describe
> established or later epic surfaces.

## Direction A layout and content

| Component | Description | States |
| --- | --- | --- |
| `PublicLayout` | Sticky dark brand header with a tightly bounded masthead mark, offset skip target, primary channels, Search, Account, page canvas and footer | guest, signed-in, mobile disclosure |
| `AccountMenu` | Login/Register or Account disclosure with Profile, Admin, Staff, Sign out | guest, public, staff, admin |
| `SiteFooter` | Compact brand mark and privacy, cookies, rights, mailing links | default |
| `DeskPanel` | Featured-story media panel, channel, headline, excerpt, byline/date and story action | empty, populated |
| `ChannelTrailTile` | Labelled line icon, channel name, description and channel link | default, focus |
| `RecentStoryCard` | Source-backed channel treatment, title, nullable excerpt and semantic publication time | default, missing metadata |
| `WorkspaceLayout` | Dark role-labelled rail, account controls, light task canvas and scrollable modal mobile drawer with contained focus and inert background | staff, admin, short viewport |
| `LineIcon` | First-party current-colour line icons without emoji dependencies | decorative |
| `ApesLogo` | Unfiltered horizontal, masthead, square, or compact APES artwork; the masthead uses a deterministic tight crop and square placement uses 384/768 WebP sources with PNG fallback | per placement, responsive |

## Staff posts

| Component | Description | States |
| --- | --- | --- |
| `PostsFilter` | All, In review, and Published navigation | active filter |
| `PostsTable` | Title edit link, labelled status, channel and updated date | desktop, empty |
| Mobile post cards | The same source-backed post fields in narrow layouts | mobile, empty |
| `PostStatusBadge` | Text-labelled post state | draft, in review, published, fallback |

## Admin moderation

| Component | Description | States |
| --- | --- | --- |
| `ModerationSummaryCard` | Pressed-state button and count for one source-backed queue | default, active |
| `ModerationQueueTabs` | Profiles, comments, reports, and suspended selectors with persistent labelled panels and roving focus | click, Arrow keys, Home/End |
| `ModerationRecordCard` | Source-backed context and existing record actions | per queue, empty |

## Existing and later epic surfaces

| Area | Components |
| --- | --- |
| Publishing | `EditorWorkspace`, `ReviewPanel`, `SeoFields`, `SchedulePicker` |
| Articles | `ArticleBody`, `AuthorByline`, `TagPill`, `Pagination`, `ChannelHero` |
| Authentication | Labelled inputs, buttons, validation errors, `AuthCard` |
| Engagement | `ReactionBar`, `CommentForm`, `CommentList`, `ProfileCard` |
| Email | `CampaignEmail` preview and test-send states |
| Feedback | `EmptyState`, branded error pages, toast messages |

Tokens from [`tokens.md`](tokens.md) map to Tailwind theme variables and
shared component classes in `resources/css/app.css`.
