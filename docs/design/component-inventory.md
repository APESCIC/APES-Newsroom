# APES Newsroom — Component inventory

> **Status:** Direction A approved under #31. Homepage, admin moderation, and
> staff posts components are implemented under #32; remaining rows describe
> established or later epic surfaces.

## Direction A layout and content

| Component | Description | States |
| --- | --- | --- |
| `PublicLayout` | Sticky dark brand header with a tightly bounded masthead mark, offset skip target, primary channels, Search, Account, page canvas and footer; the short-height mobile disclosure scrolls, nested Escape closes one layer at a time, and breakpoint changes transfer focus between visible mobile and desktop navigation | guest, signed-in, mobile disclosure, nested disclosure, short viewport, breakpoint change |
| `AccountMenu` | Login/Register or Account disclosure with Profile, Admin, Staff, Sign out; Escape closes only this disclosure and restores its trigger, while breakpoint changes close a presentation that becomes hidden and transfer its focus to visible navigation | guest, public, staff, admin, nested mobile disclosure, breakpoint change |
| `SiteFooter` | Dedicated 64px brand mark and privacy, cookies, rights, mailing links with minimum 44×44px touch targets | default |
| `DeskPanel` | Featured-story media panel, channel, headline, excerpt, byline/London publication date and story action | empty, populated |
| `ChannelTrailTile` | Labelled line icon, channel name, description and channel link | default, focus |
| `RecentStoryCard` | Source-backed channel treatment, title, nullable excerpt and semantic Europe/London publication time | default, missing metadata |
| `WorkspaceLayout` | Dark role-labelled rail, account controls, light task canvas, measured skip-link offset and scrollable modal mobile drawer with contained focus, inert and scroll-locked background, and automatic close to the active desktop destination at the desktop breakpoint | staff, admin, wrapped task header, short viewport, breakpoint change |
| `LineIcon` | First-party current-colour line icons without emoji dependencies | decorative |
| `ApesLogo` | Unfiltered horizontal, masthead, footer, square, or compact APES artwork; the masthead uses a deterministic tight crop, the footer uses a 64px derivative, and square placement uses 384/768 WebP sources with PNG fallback | per placement, responsive |

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
