<?php

use App\Providers\AppServiceProvider;
use App\Providers\CloudronEnvironmentServiceProvider;

return [
    // Must run first: rewrites DB_*/REDIS_*/MAIL_* config from Cloudron's
    // CLOUDRON_*-prefixed addon environment variables before any other
    // provider can lazily open a connection using stale defaults.
    CloudronEnvironmentServiceProvider::class,
    AppServiceProvider::class,
];
