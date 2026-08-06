# APES Newsroom — Accessibility Notes (draft)

> **Status:** First-pass draft targeting WCAG 2.2 AA (#2, #10).

## Global requirements

- [ ] Skip link to `#main-content` on every page
- [ ] Logical heading hierarchy (one `h1` per page)
- [ ] Landmarks: `header`, `nav`, `main`, `footer`
- [ ] Visible focus on all interactive elements
- [ ] 4.5:1 contrast for body text, 3:1 for large text
- [ ] No information conveyed by colour alone
- [ ] 200% zoom without horizontal scroll (reflow)
- [ ] 44×44px minimum touch targets
- [ ] Respect `prefers-reduced-motion`

## Public newsroom

| Surface | Checks |
|---------|--------|
| Homepage | Keyboard nav through featured cards; alt text on hero images |
| Channel pages | Channel accent does not reduce text contrast below AA |
| Article | Semantic article markup; image alt/caption/credit; readable line length |
| Search | Labelled input; results announced; empty state |
| RSS/sitemap | Machine-readable; no a11y impact on humans |

## Authentication

| Surface | Checks |
|---------|--------|
| Login/register | Labels associated with inputs; errors linked via `aria-describedby` |
| Magic link | Clear instructions; no account enumeration via UI |
| Staff OIDC | Accessible button; error messages readable |
| Email verification | Status messages announced |

## Editor.js workspace

| Surface | Checks |
|---------|--------|
| Block toolbar | Keyboard-operable; focus not trapped |
| Image blocks | Alt text required before save |
| Preview | Same renderer as production; `noindex` |

## Mailing preferences

| Surface | Checks |
|---------|--------|
| Signup | Unchecked list boxes; clear purpose labels |
| Preference centre | Per-list controls labelled; unsubscribe-all available |
| HTML email | Semantic structure; alt on hero; sufficient contrast |

## Moderation

| Surface | Checks |
|---------|--------|
| Queues | Table/list keyboard navigable; action buttons labelled |
| Rejection reasons | Visible to moderators only; not leaked publicly |

## Testing plan

1. Automated: axe-core in CI on key page templates
2. Manual keyboard: tab through all interactive flows
3. Screen reader: NVDA/VoiceOver smoke on login, article read, preference centre
4. Zoom: 200% on article and form pages

## Sign-off

- [ ] Design review complete
- [ ] Automated checks green
- [ ] Manual keyboard pass
- [ ] Screen reader smoke pass
- [ ] Named accessibility approver recorded
