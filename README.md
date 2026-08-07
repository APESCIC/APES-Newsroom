# APES Newsroom

[![CI](https://github.com/APESCIC/APES-Newsroom/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/APESCIC/APES-Newsroom/actions/workflows/ci.yml)

Public newsroom and authenticated publishing/campaign/moderation
workspaces for the [Association for the Protection of Exotic Species
(APES CIC)](https://apes.org.uk), covering APES CIC, APES Shelter &
Rescue, and APES Pet Care Clinic. Replaces the existing Ghost site.

See [Issue #1](https://github.com/APESCIC/APES-Newsroom/issues/1) for the
full epic and [`docs/epic-1-build-plan.md`](docs/epic-1-build-plan.md) for
how the ten sub-issues sequence against each other. Agents and contributors:
track work via GitHub Issues per [`AGENTS.md`](AGENTS.md).

## Repository status

Last verified: **2026-08-07T13:38:11+01:00**. APES Newsroom is in active
pre-release development. The PHP formatting baseline was restored through
[issue #33](https://github.com/APESCIC/APES-Newsroom/issues/33); the Direction A
homepage, staff desk, and admin workspace are tracked by
[issue #32](https://github.com/APESCIC/APES-Newsroom/issues/32) and delivered for
review in [PR #34](https://github.com/APESCIC/APES-Newsroom/pull/34).
Production deployment and the Ghost cutover remain separately authorized work.

## Stack

Laravel 13, Inertia, React, TypeScript, PHP 8.4, MySQL, Redis. Runs on an
existing Cloudron LAMP app - see [`docs/deployment.md`](docs/deployment.md)
for how deploys work.

## Local setup

```
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run dev    # or: npm run build
php artisan serve
```

No MySQL or Redis needed for local dev - `.env.example` defaults to
sqlite, database-backed sessions/cache/queue. For production-like local
testing with Redis and OIDC, see [`docs/local-dev.md`](docs/local-dev.md).
In Cloudron, `CloudronEnvironmentServiceProvider` (`app/Providers`) overrides
these from the platform's `CLOUDRON_*` environment variables automatically; see
that file and `.env.example` for what's mapped.

## Testing

```
composer lint        # PHP style (Laravel Pint --test; same as CI)
composer format      # auto-fix PHP style with Pint
composer test        # or: php artisan test
npm run typecheck
npm run lint         # ESLint on resources/js
npm run test:frontend
```

## Health check

`GET /health` reports database and cache connectivity as a plain
`{"status": "ok", "checks": {...}}` - no configuration or secrets in the
response. Used by Cloudron and external uptime monitoring.

## Deployment

Guarded, manually-triggered deploy to beta via GitHub Actions - see
[`docs/deployment.md`](docs/deployment.md) for the full runbook,
one-time setup, and rollback procedure. Production deployment and the
Ghost cutover are separately authorized later work (issue #11).

## Project links and support

- [Documentation](docs/epic-1-build-plan.md), [local development](docs/local-dev.md), and [deployment runbook](docs/deployment.md)
- [Direction A design record](docs/design/direction-a-ui.md) and [design tokens](docs/design/tokens.md)
- [Report a bug](https://github.com/APESCIC/APES-Newsroom/issues/new?template=bug_report.yml) or [request a feature](https://github.com/APESCIC/APES-Newsroom/issues/new?template=feature_request.yml)
- [All issues](https://github.com/APESCIC/APES-Newsroom/issues), [Discussions](https://github.com/APESCIC/APES-Newsroom/discussions), and [Releases](https://github.com/APESCIC/APES-Newsroom/releases)

The repository is maintained by [APES CIC](https://github.com/APESCIC). A
private security-reporting route is not yet documented; do not disclose
potential vulnerabilities in a public issue.
