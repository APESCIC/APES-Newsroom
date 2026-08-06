# Agent guide — APES Newsroom

Instructions for AI agents and contributors working in this repository.

## Source of truth for work

Track all product and engineering work with **GitHub Issues** on
[APESCIC/APES-Newsroom](https://github.com/APESCIC/APES-Newsroom/issues).

- Epic: [#1 Build and launch APES Newsroom](https://github.com/APESCIC/APES-Newsroom/issues/1)
- Sequencing and dependency map: [`docs/epic-1-build-plan.md`](docs/epic-1-build-plan.md)
- Sub-issues #2–#11 cover design, foundation, auth, publishing, newsroom,
  mailing, engagement, Ghost migration, governance, and cutover

Do not treat chat history, local notes, or unlinked PRs as the record of
what is done. Update the relevant issue(s).

## Issue workflow (required)

### Before coding

1. Find an existing open issue that covers the work, or **create** one.
2. For epic-scoped work, link the parent (`Parent: #1` or “Relates to #1”).
3. Work on a branch; reference `#N` in commit messages and PR titles/bodies
   (conventional commits: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`).

### During work

- Comment on the issue when a milestone lands (merge, new surface, blocker).
- If scope splits into a discrete leftover that does not fit an existing
  sub-issue, open a new issue rather than burying it only in a PR.

### When finishing a chunk

1. Comment what shipped (PR/commit links) and what remains vs the issue’s
   acceptance criteria.
2. **Close the issue only when acceptance criteria are met** (or explicitly
   waived in the issue). Never close for “mostly done” or “code on main.”
3. When a delivery phase completes, add a short progress comment on epic #1.

```text
find/create issue → implement on branch → PR references #N
  → comment progress → AC met? → close : leave open with gaps
```

## Authorization boundary

Completing or closing issues does **not** authorize:

- production deployment or hostname cutover (`apesnews.org.uk`)
- live campaign sends
- retiring or deleting Ghost

Those require separate, explicit sign-off (see issue #11 and the epic body).

## Project pointers

| Topic | Where |
|-------|--------|
| Local setup & testing | [`README.md`](README.md) |
| Redis/OIDC local stack | [`docs/local-dev.md`](docs/local-dev.md) |
| Deploy & rollback | [`docs/deployment.md`](docs/deployment.md) |
| Beta acceptance checklist | [`docs/deployment-beta-acceptance.md`](docs/deployment-beta-acceptance.md) |
| Design drafts | [`docs/design/`](docs/design/) |

Quick checks before opening a PR: `composer test`, `composer lint`,
`npm run typecheck`, `npm run lint`.
