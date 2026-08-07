# Direction A UI selection

Status: stakeholder-approved as a complete three-page set on 2026-08-06 under
[issue #31](https://github.com/APESCIC/APES-Newsroom/issues/31). Implementation
is tracked under [issue #32](https://github.com/APESCIC/APES-Newsroom/issues/32).

## Review set

- [Full Superdesign canvas](https://superdesign.dev/teams/bf762f23-1efb-4c0f-83c8-fee55710af77/projects/aaffdc59-7382-41a7-ac0c-60922f956e40)
- [Homepage preview](https://p.superdesign.dev/draft/eb3a5add-fe71-4443-8903-0f7c670fde0f)
- [Admin moderation preview](https://p.superdesign.dev/draft/c9aa0de9-ea46-4881-be99-c571ba4f0258)
- [Staff editorial desk preview](https://p.superdesign.dev/draft/063c0598-af73-4439-933f-512d1502f9e0)

## Selected character

Direction A is a story-led conservation editorial system. The public newsroom
uses a dark APES masthead, confident story hierarchy, light surfaces and a
contained mission panel. Authenticated workspaces retain the same brand ink,
teal and typography but prioritise dense, calm task completion.

The supplied horizontal, square and compact APES logo files are the only brand
marks. Their artwork and aspect ratios remain unchanged without filters or
recolouring. The square PNG remains the canonical fallback and is served with
deterministic 384px and 768px WebP derivatives for responsive delivery.

Instrument Sans Variable 5.3.0 is self-hosted from the application bundle so
the restrictive content security policy does not depend on a remote font host.
Direction A uses supported weights 400–700; headings that were initially
specified at a synthetic 800 weight use 700.

## Page decisions

### Homepage

- Featured story and mission artwork form a 7/5 desktop hero.
- Three labelled channel entry cards preserve APES CIC, Shelter & Rescue and
  Pet Care Clinic identities.
- Recent stories follow in a responsive editorial grid and expose their
  nullable excerpt and semantic publication date when supplied.
- Public navigation and account actions remain source- and role-aware; no new
  archive route is introduced.

### Admin moderation

- A dark workspace rail frames a light moderation canvas.
- Four queue summaries map directly to pending profiles, pending comments,
  open reports and suspended profiles.
- Available actions remain Approve, Reject, Suspend, Resolve, Dismiss and Lift
  suspension. No analytics, bulk actions, settings, or user management are
  implied.

### Staff editorial desk

- The workspace shell matches admin while retaining a Staff label and
  role-aware Admin panel entry.
- Existing All, In review and Published filters remain.
- Review queue, New draft and title-based edit links retain their current
  permission and route behaviour.
- The desktop table becomes accessible post cards on narrow screens.

Mock-up names, story text, identities, dates, and counts are illustrative. They
are not production content or new product requirements. Approval and
implementation do not authorize merging, deployment, campaign sends, Ghost
retirement, or production cutover.
