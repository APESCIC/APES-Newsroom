# Epic #1 build plan: APES Newsroom (replacing Ghost)

Source: [Issue #1](https://github.com/APESCIC/APES-Newsroom/issues/1) and its sub-issues (#2–#11, #18).

**Code-complete v1 status (2026-08-06):** Engineering acceptance for #5–#9 and #18 is implemented on `feat/v1-code-complete` (Editor.js publishing UX, discovery/archives/redirects, Ghost content CLI import, governance surfaces, admin Ghost members CSV importer). Still open / gated: #2 design approval, #3 watched beta deploy, #4 live OIDC/LDAP proof, #10 legal/a11y sign-off, #11 production cutover.

## What we're building

One Laravel 13 + Inertia/React app on the existing Cloudron LAMP app (`74a2a784-a161-4787-84ff-2b8efc957bc8`), with two surfaces: a public SEO newsroom for three APES channels (CIC, Shelter & Rescue, Pet Care Clinic), and authenticated workspaces for publishing, campaigns, moderation, and governance. Public accounts use password/magic-link login; staff use Cloudron OIDC + LDAP role mapping. Content is versioned Editor.js JSON with a server-enforced block allowlist. Mailing lists are per-channel, double opt-in, queued through Cloudron SMTP. Ghost content and mailing lists are imported from Admin export files (content JSON + media archive, then members CSV); Ghost isn't retired until a separately authorized cutover.

Shared contracts used across multiple issues: `Role` (public/staff/admin/super_admin), `PostStatus` (draft/in_review/scheduled/published/unpublished/deleted), `MailingList` (apes_cic/apes_shelter_rescue/apes_pet_care_clinic), `ModerationStatus` (private/pending/approved/rejected/suspended), `ReactionType` (helpful/support/thank_you).

## Authorization boundary (applies throughout)

Every sub-issue repeats some version of this, so it's worth stating once: completing any issue, including the epic, does **not** authorize production deployment, Cloudron hostname changes, live campaign sends, or deleting/retiring Ghost. Those each require separate, explicit sign-off from Bambie when the time comes — this plan doesn't change that.

## Dependency map

```
        +------------+   +----------------------+
        | #2 Design  |   | #3 Laravel foundation |
        | (IA/visual)|   | (infra, CI, deploy)   |
        +-----+------+   +-----------+-----------+
              |                      |
              |              +-------v--------+
              |              | #4 Accounts &   |
              |              | Cloudron RBAC   |
              |              +-------+---------+
              |                      |
       +------+----------------------+------------------+
       |                             |                  |
+------v-------+            +--------v--------+         |
| #6 Public     |<--------- | #5 Editor.js     |         |
| newsroom/     |  content  | publishing/SEO   |         |
| discovery     |           | workflow         |         |
+------+--------+           +--------+---------+         |
       |                             |                   |
       |                    +--------v---------+         |
       |                    | #7 Mailing lists, |         |
       |                    | consent, campaigns|         |
       |                    +--------+---------+         |
       |                             |                    |
+------v--------+                    |                    |
| #8 Profiles,   |                    |                    |
| comments,      |                    |                    |
| reactions      |                    |                    |
+------+---------+                    |                    |
       |                             |                    |
       +--------------+--------------+--------------------+
                       |
              +--------v-------------+
              | #9 Ghost content/     |
              | media/redirects       |
              | import (needs #5,#6)  |
              +--------+--------------+
                       |
       #10 Governance (GDPR/PECR/security/a11y) - runs
       continuously alongside every issue above, formal
       sign-off gates here before mailing import / cutover
                       |
              +--------v-------------+
              | #18 Ghost mailing CSV |
              | import (needs #7)     |
              +--------+--------------+
                       |
              +--------v---------+
              | #11 Validate,     |
              | cut over, retire  |
              | Ghost (gated)     |
              +-------------------+
```

## Phases

**Phase 0 — Foundation (parallel tracks)**
- **#3 Laravel foundation & guarded Cloudron delivery.** Laravel 13/Inertia/React/TS/PHP 8.4, MySQL, Redis, health endpoint, CI (backend, frontend, lint, types, security, prod build), protected deployment environment, the full guarded-deploy sequence (backup → versioned artifact → migrate → activate → verify workers/scheduler → health/smoke → rollback). Nothing else can be built without this. Recommended starting point.
- **#2 Design: IA & visual system.** Sitemap, navigation, responsive wireframes/prototypes, component inventory, design tokens, email template designs, WCAG 2.2 AA accessibility annotations. This is a design deliverable, not code — can run in parallel with #3, but frontend work in #4–#8 shouldn't proceed past scaffolding until relevant flows here are stakeholder-approved.

**Phase 1 — Identity**
- **#4 Public accounts + Cloudron staff RBAC.** Depends on #3. Establishes the `Role` contract every later authorization check (#5, #7, #8) relies on: public registration/magic-link/password reset, staff via OIDC+LDAP group mapping, fail-closed reconciliation, full authz test matrix.

**Phase 2 — Content and reading (parallel once #4 lands)**
- **#5 Editor.js publishing/approval/scheduling/SEO workflow.** Depends on #3, #4. Defines the post schema, block allowlist, revision/approval/scheduling state machine, SEO fields, transaction-safe publish. #6 and #9 both build on this schema, so it should land before or alongside #6 rather than after.
- **#6 Public newsroom & article discovery.** Depends on #3, #2 (approved page designs), and effectively #5 (needs a post schema to render against, even if seeded with fixtures early). Homepage, channel pages, article/author/search/archive, RSS/sitemap/structured data, redirects, accessibility.

**Phase 3 — Engagement**
- **#7 Mailing lists, consent, queued campaigns.** Depends on #4 (accounts/contacts) and #5 (the email-this-post flag and approval-time content snapshot live in the publishing workflow). Double opt-in, per-list unsubscribe, consent ledger, Cloudron SMTP queued send, throttling. Runtime mailing product only — Ghost member import is #18.
- **#8 Moderated profiles, comments, reactions.** Depends on #4 (accounts) and #6 (article pages to attach to). Private-by-default profiles, pre-moderated comments, three toggleable reactions.

**Phase 4 — Content import**
- **#9 Import Ghost posts, media, and redirects from content export.** Depends on #5 (target content schema) and #6 (target slugs/redirects) being stable. File-based import from Ghost content JSON + media archive. Dry-run, resumable/idempotent, no email from import runs. Mailing/members/consent are out of scope (see #18).

**Phase 5 — Governance (continuous + gated)**
- **#10 GDPR/PECR/security/accessibility governance.** Not a phase that starts after everything else — threat modeling, CSRF/authz/rate-limit controls, CI security checks, and accessibility checks should be built into #3–#9 as they're written. What's specific to #10 is the formal artifact: data inventory, retention schedule, privacy/cookie copy, rights workflows, recorded legal/compliance and accessibility approvals as an explicit launch gate before #18 and #11.

**Phase 5b — Mailing import (pre-cutover)**
- **#18 Import Ghost mailing lists from members CSV export.** Depends on #7 (target contact/consent/suppression models) and runs after #10 formal gates, immediately before #11. File-based import from Ghost members CSV: mailing contacts (not accounts), fail-closed three-list activation, suppressions, dry-run/resumable/idempotent, reconciliation report, no email from import runs.

**Phase 6 — Cutover**
- **#11 Validate, cut over apesnews.org.uk, retire Ghost safely.** Depends on everything above. Beta acceptance across every surface (including separate content and mailing import dry-runs), throughput benchmarking, backup/restore/rollback drills, then — only after separate production authorization — the guarded cutover with final content import then final mailing import from export files, and a defined rollback window. Ghost retirement is a further separate authorization after that window.

## Open questions worth resolving before/while work starts

Who is doing the #2 design work — is that Bambie/a designer producing wireframes and tokens outside this session, or should I produce a first-pass sitemap/component inventory as a working draft? Access to Cloudron env values, the Cloudron OIDC client, LDAP group names, and Ghost Admin exports (content JSON + media archive for #9; members CSV for #18) will be needed before env wiring and import work can be more than scaffolding — no live Ghost API access is required. And #10's legal/compliance sign-off needs a named approver — worth confirming who that is early rather than at the #11 gate.

## Suggested next step

**Code-complete v1 is implemented** on `feat/v1-code-complete`. Next operational steps (not authorized by this plan alone):

1. Stakeholder approval for #2 design drafts (or explicit waiver)
2. Watched beta deploy + rollback drill (#3) and live OIDC/LDAP proof (#4)
3. Legal/compliance + accessibility sign-off on #10 artifacts
4. Authorized final content import (#9) then mailing CSV import (#18) then cutover (#11)
