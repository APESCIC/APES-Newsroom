# Beta deployment acceptance checklist (issue #3, #11)

This checklist records the watched beta acceptance completed on 2026-08-06.
The principal evidence is the
[#3 deploy and rollback record](https://github.com/APESCIC/APES-Newsroom/issues/3#issuecomment-5208564154),
the [scheduler follow-up](https://github.com/APESCIC/APES-Newsroom/issues/3#issuecomment-5208596000),
and the [successful beta surface smoke](https://github.com/APESCIC/APES-Newsroom/issues/11#issuecomment-5208734964).

## Pre-deploy

- [x] GitHub `beta` environment secrets configured (`CLOUDRON_FQDN`, `CLOUDRON_TOKEN`, `CLOUDRON_APP_ID`, `CLOUDRON_APP_ORIGIN_HOST`)
- [x] One-time server setup complete (PHP 8.4, Apache config, `run.sh`, scheduler cron)
- [x] Redis addon enabled and `CLOUDRON_REDIS_*` vars present
- [x] OIDC client registered with beta redirect URI
- [x] LDAP groups created and `config/rbac.php` keys verified
- [x] Guarded deployment preflight passed with Cloudron database/Redis reachable and `APP_DEBUG=false`

## Deploy execution

- [x] Trigger "Deploy to Cloudron (beta)" workflow manually from `main`
- [x] Cloudron backup created successfully before activation
- [x] Migrations run without error
- [x] Activate log shows MySQL assert (`www-data artisan targets MySQL`) — not silent sqlite
- [x] Health check passes within 60 seconds
- [x] Workflow reports success
- [x] Homepage `/` returns 200 (not only `/health` / `/login`)

## Post-deploy verification

| Check | Command / action | Expected | Evidence |
|-------|------------------|----------|----------|
| Health | `curl https://beta.apesnews.org.uk/health` | `database: true`, `cache: true` | #3 final deploy record |
| Homepage | Visit `/` | Renders without error | #3 smoke: HTTP 200 |
| Login | Visit `/login` | Staff sign-in visible when OIDC configured | #11 beta smoke |
| Staff OIDC | Complete staff login | User created with correct role | #4 live proof, referenced by #11 |
| Queue worker | Dispatch test job | Job processed via Redis | #3 Redis/worker verification |
| Scheduler | Wait for scheduled command | `staff:reconcile-roles` runs daily | #3 scheduler follow-up |
| Logs | Check `/app/data/shared/storage/logs/` | No secrets in output | #10 launch-gate approval |

## Rollback drill

- [x] Note current release SHA from `/app/data/current`
- [x] Run `deploy/cloudron-rollback.sh` via `cloudron exec`
- [x] Restart app
- [x] Verify previous release serves `/health` successfully
- [x] Re-deploy latest release to restore beta to current state
- [x] Confirm rollback did not delete release directories

## Local preflight evidence (2026-08-06)

Run from development checkout before Cloudron credentials are available:

```
php artisan deploy:preflight --target=beta
```

Expected local failures (no Cloudron env):
- `git.clean_tree` — uncommitted changes during active development
- `env.debug_disabled` — `APP_DEBUG=true` in local `.env`
- `database.reachable` — no Cloudron MySQL from local machine

These were expected in local development and were not treated as beta evidence.
The watched Cloudron run supplied the guarded-target evidence above.

## Authorization

Completion of this checklist did not itself authorize production cutover.
Cutover later received a separate authorization on #11 and completed on
2026-08-06. Ghost retirement/deletion remains unauthorized.
