# APES Newsroom

Public newsroom and authenticated publishing/campaign/moderation
workspaces for the [Association for the Protection of Exotic Species
(APES CIC)](https://apes.org.uk), covering APES CIC, APES Shelter &
Rescue, and APES Pet Care Clinic. Replaces the existing Ghost site.

See [Issue #1](https://github.com/APESCIC/APES-Newsroom/issues/1) for the
full epic and [`docs/epic-1-build-plan.md`](docs/epic-1-build-plan.md) for
how the ten sub-issues sequence against each other.

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
