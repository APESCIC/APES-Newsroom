#!/bin/bash
#
# Runs INSIDE the Cloudron LAMP app container (via `cloudron exec`).
# Repoints /app/data/current back to the release recorded before the last
# activation and re-caches config/routes/views for it. Does not restart
# the app - the caller issues `cloudron restart` afterwards, same as
# activation.
#
# Usage: bash /app/data/current/deploy/cloudron-rollback.sh

set -euo pipefail

DATA_DIR="/app/data"
CURRENT_LINK="${DATA_DIR}/current"
PREVIOUS_FILE="${DATA_DIR}/previous_release"

if [ ! -f "${PREVIOUS_FILE}" ]; then
    echo "No recorded previous release to roll back to (${PREVIOUS_FILE} missing)." >&2
    exit 1
fi

PREVIOUS_RELEASE_DIR="$(cat "${PREVIOUS_FILE}")"

if [ ! -d "${PREVIOUS_RELEASE_DIR}" ]; then
    echo "Recorded previous release ${PREVIOUS_RELEASE_DIR} no longer exists." >&2
    exit 1
fi

echo "==> Rolling back to ${PREVIOUS_RELEASE_DIR}"
sudo -u www-data php "${PREVIOUS_RELEASE_DIR}/artisan" config:cache
sudo -u www-data php "${PREVIOUS_RELEASE_DIR}/artisan" route:cache
sudo -u www-data php "${PREVIOUS_RELEASE_DIR}/artisan" view:cache

ln -sfn "${PREVIOUS_RELEASE_DIR}" "${CURRENT_LINK}.new"
mv -Tf "${CURRENT_LINK}.new" "${CURRENT_LINK}"

echo "==> Rolled back. Caller must still run 'cloudron restart' to pick this up."
