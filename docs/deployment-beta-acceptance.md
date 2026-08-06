# Beta deployment acceptance checklist (issue #3, #11)

Use this checklist during the first watched beta deploy to `beta.apesnews.org.uk`.
Record evidence (screenshots, command output, timestamps) in issue #3 comments.

## Pre-deploy

- [ ] GitHub `beta` environment secrets configured (`CLOUDRON_FQDN`, `CLOUDRON_TOKEN`, `CLOUDRON_APP_ID`, `CLOUDRON_APP_ORIGIN_HOST`)
- [ ] One-time server setup complete (PHP 8.4, Apache config, `run.sh`, scheduler cron)
- [ ] Redis addon enabled and `CLOUDRON_REDIS_*` vars present
- [ ] OIDC client registered with beta redirect URI
- [ ] LDAP groups created and `config/rbac.php` keys verified
- [ ] `php artisan deploy:preflight --target=beta` passes on a clean checkout with `APP_DEBUG=false` and Cloudron database reachable

## Deploy execution

- [ ] Trigger "Deploy to Cloudron (beta)" workflow manually from `main`
- [ ] Cloudron backup created successfully before activation
- [ ] Migrations run without error
- [ ] Health check passes within 60 seconds
- [ ] Workflow reports success

## Post-deploy verification

| Check | Command / action | Expected | Evidence |
|-------|------------------|----------|----------|
| Health | `curl https://beta.apesnews.org.uk/health` | `database: true`, `cache: true` | |
| Homepage | Visit `/` | Renders without error | |
| Login | Visit `/login` | Staff sign-in visible when OIDC configured | |
| Staff OIDC | Complete staff login | User created with correct role | |
| Queue worker | Dispatch test job | Job processed via Redis | |
| Scheduler | Wait for scheduled command | `staff:reconcile-roles` runs daily | |
| Logs | Check `/app/data/shared/storage/logs/` | No secrets in output | |

## Rollback drill

- [ ] Note current release SHA from `/app/data/current`
- [ ] Run `deploy/cloudron-rollback.sh` via `cloudron exec`
- [ ] Restart app
- [ ] Verify previous release serves `/health` successfully
- [ ] Re-deploy latest release to restore beta to current state
- [ ] Confirm rollback did not delete release directories

## Local preflight evidence (2026-08-06)

Run from development checkout before Cloudron credentials are available:

```
php artisan deploy:preflight --target=beta
```

Expected local failures (no Cloudron env):
- `git.clean_tree` — uncommitted changes during active development
- `env.debug_disabled` — `APP_DEBUG=true` in local `.env`
- `database.reachable` — no Cloudron MySQL from local machine

These are expected in local dev. Re-run preflight from CI or a machine with beta `.env` before deploying.

## Authorization

Completing this checklist does **not** authorize production cutover (#11) or Ghost retirement.
