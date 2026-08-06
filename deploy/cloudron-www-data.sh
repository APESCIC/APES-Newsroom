#!/bin/bash
#
# Run a command as www-data while preserving Cloudron addon environment
# variables (CLOUDRON_*).
#
# Plain `sudo -u www-data` resets the environment. Without CLOUDRON_MYSQL_*,
# CloudronEnvironmentServiceProvider leaves DB_CONNECTION=sqlite from the
# shared .env, so artisan migrate/queue/schedule silently target SQLite while
# Apache/php-fpm (which still has CLOUDRON_*) serves MySQL. That mismatch
# caused beta homepage 500s after a "successful" migrate (#3).
#
# Usage (from activate/rollback/run/cron):
#   bash /app/data/current/deploy/cloudron-www-data.sh \
#     /usr/bin/php /app/data/current/artisan migrate --force

set -euo pipefail

if [ "$#" -lt 1 ]; then
    echo "usage: cloudron-www-data.sh <command> [args...]" >&2
    exit 1
fi

preserve=()
while IFS= read -r line; do
    preserve+=("$line")
done < <(env | grep '^CLOUDRON_' || true)

if [ "${#preserve[@]}" -eq 0 ]; then
    echo "warning: no CLOUDRON_* vars in this shell; artisan may fall back to .env sqlite" >&2
fi

exec sudo -u www-data env "${preserve[@]}" "$@"
