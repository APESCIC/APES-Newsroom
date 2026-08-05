# Deploying to Cloudron (issue #3)

This documents the guarded deploy pipeline for the existing Cloudron LAMP
app (`74a2a784-a161-4787-84ff-2b8efc957bc8`), which currently runs Ghost
and will be repointed at this app per the epic (#1) plan: build and accept
at `beta.apesnews.org.uk`, then cut over `apesnews.org.uk` separately (#11).

**Nothing in this document has been run.** The workflow, scripts, and
setup steps below are written and internally consistent against
Cloudron's documented behaviour (docs.cloudron.io), but there is no
Cloudron API token or access from this environment to test them end to
end. Treat the first real run as the acceptance exercise issue #3 and
#11 both call for - run it against beta, watched, with `docs.cloudron.io`
open, before trusting it unattended.

## How a release is structured on the server

```
/app/data/
  releases/
    <git-sha>/            one directory per deploy, immutable once activated
  shared/
    .env                  persists across every release (holds APP_KEY)
    storage/app/          user-uploaded files, persists across releases
    storage/logs/         persists across releases
  current -> releases/<git-sha>   atomic symlink; Apache serves current/public
  previous_release        text file: what `current` pointed to before the last activation
  run.sh                  starts the queue worker on every app boot/restart
  PHP_VERSION              "8.4"
  apache/app.conf          DocumentRoot -> /app/data/current/public
```

Activating a release is a symlink swap (`deploy/cloudron-activate.sh`), so
it is atomic from Apache's point of view. Rolling back
(`deploy/cloudron-rollback.sh`) swaps it back to whatever `previous_release`
recorded. Neither script deletes anything, so a bad release stays on disk
for inspection until manually cleaned up.

## One-time manual setup

These happen once, outside of CI, before the first deploy can work.

1. **Cloudron dashboard, this app's Location/SSO/etc.** already exist
   (it's the existing Ghost app being repointed) - no change needed here
   yet. Repointing DNS/hostname is issue #11's guarded cutover, not this.

2. **Pin PHP to 8.4** (issue #3 requires PHP 8.4; Cloudron LAMP defaults
   to 8.3):
   ```
   cloudron --server <fqdn> --token <token> push --app <app-id> deploy/PHP_VERSION /app/data/PHP_VERSION
   cloudron --server <fqdn> --token <token> restart --app <app-id>
   ```

3. **Point Apache at the releases symlink and disable phpMyAdmin.** Copy
   `deploy/cloudron-apache-app.conf` to `/app/data/apache/app.conf` (File
   Manager, or `cloudron push`), then restart the app. See that file's
   comments - phpMyAdmin's include is already commented out, satisfying
   the issue #3 acceptance criterion.

4. **Install the queue worker startup script.** Copy
   `deploy/cloudron-run.sh` to `/app/data/run.sh` (File Manager, or
   `cloudron push`). Runs on every app boot/restart.

5. **Add the scheduler cron entry.** In the Cloudron dashboard, this
   app's `Cron` section, add:
   - Schedule: `* * * * *`
   - Command: `sudo -u www-data /usr/bin/php /app/data/current/artisan schedule:run`

   (Cloudron's per-app Cron feature, not a crontab file - see
   docs.cloudron.io/apps#cron.)

6. **GitHub: protected `beta` environment.** Repo Settings -> Environments
   -> New environment `beta`. Add required reviewers (per issue #3's
   "protected GitHub deployment environment"). Add these environment
   secrets, scoped to `beta` only:
   - `CLOUDRON_FQDN` - the Cloudron instance's hostname
   - `CLOUDRON_TOKEN` - an API token from the Cloudron profile page, with
     the minimum scope needed for exec/push/restart/backup on this app
   - `CLOUDRON_APP_ID` - `74a2a784-a161-4787-84ff-2b8efc957bc8`
   - `CLOUDRON_APP_ORIGIN_HOST` - the beta hostname the health check
     should curl, e.g. `beta.apesnews.org.uk`

## What a deploy actually does

Trigger: Actions tab -> "Deploy to Cloudron (beta)" -> Run workflow, typing
`main` to confirm. Deliberately manual (see the workflow file's comment)
rather than automatic on every push, while the pipeline is unproven.

1. Verifies the input branch confirmation matches `main` and that the
   workflow is actually running against `main`.
2. Builds a production artifact in the runner: `composer install --no-dev
   --optimize-autoloader`, `npm ci && npm run build`. No dependency
   installation happens on the Cloudron box itself.
3. Assembles a clean `release/` directory (no `.git`, tests, `node_modules`,
   or `.env` - matches "do not build dependencies interactively in
   production" and "never commit credentials").
4. `cloudron backup create --app ...` - one blocking app-level backup
   before anything touches the server.
5. `cloudron sync push` uploads `release/` to
   `/app/data/releases/<short-sha>/`.
6. `cloudron exec ... deploy/cloudron-activate.sh <sha>` - inside the
   container: links the persistent `.env` and `storage/app`/`storage/logs`
   into the new release, runs `artisan migrate --force`, caches
   config/routes/views, then atomically repoints `/app/data/current`.
7. `cloudron restart` - picks up the new code for both Apache and the
   queue worker (`run.sh` runs again on boot).
8. Polls `https://<beta-host>/health` for up to 60 seconds.
9. If activation, restart, or the health check fails: runs
   `deploy/cloudron-rollback.sh` (repoints `current` back to
   `previous_release`), restarts again, and fails the workflow loudly.
   The workflow does **not** assume rollback succeeded - it says so and
   expects a human to verify.

## Manual rollback

If a bad release is discovered after the fact (health looked fine but
something's actually broken):

```
cloudron --server <fqdn> --token <token> exec --app <app-id> -- \
  bash /app/data/current/deploy/cloudron-rollback.sh
cloudron --server <fqdn> --token <token> restart --app <app-id>
```

This only goes back one step (whatever `previous_release` recorded at the
last activation). Old release directories under `/app/data/releases/` are
never deleted automatically, so reactivating an older one is a manual
symlink edit inside `cloudron exec` if a deeper rollback is ever needed.

## Preflight command

`php artisan deploy:preflight --target=beta` checks git cleanliness (when
run from a checkout), required env vars, `APP_DEBUG` being off for
guarded targets, database/Redis connectivity, and pending migrations. It
never changes anything. It's a single `php artisan ...` invocation, so it
runs identically from PowerShell, cmd, or bash - no separate Windows
script to maintain. Run it locally against a non-production database
before trusting a new environment, and it's what
`DeployPreflightCommandTest` exercises in CI.

## What this does not do

Production (`apesnews.org.uk`) deployment is a separate, later workflow
gated on issue #11's beta acceptance and explicit production
authorization - it doesn't exist yet, on purpose. This pipeline only ever
touches beta.
