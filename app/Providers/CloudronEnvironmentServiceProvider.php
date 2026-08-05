<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

/**
 * Bridges Cloudron's addon environment variables into Laravel's own
 * configuration keys at boot time.
 *
 * Cloudron injects credentials for provisioned addons (MySQL, Redis,
 * outbound mail) as CLOUDRON_*-prefixed environment variables, and those
 * values are rotated by the platform - they must be read at runtime, never
 * cached or committed (see docs.cloudron.io/packaging/addons). Laravel's
 * own config files expect the conventional DB_*/REDIS_*/MAIL_* names.
 * This provider translates one into the other so the same config files
 * and .env-driven local/CI setup work unchanged in both environments:
 * when a CLOUDRON_* variable is absent (local dev, CI), nothing is
 * overridden and the standard .env values apply.
 *
 * This must run before anything resolves a database, cache, queue, or
 * mail connection - register() runs before those are ever lazily
 * connected, and this provider is listed first in bootstrap/providers.php.
 */
class CloudronEnvironmentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mapMysql();
        $this->mapRedis();
        $this->mapMail();
        $this->mapAppOrigin();
    }

    private function mapMysql(): void
    {
        if (! env('CLOUDRON_MYSQL_HOST')) {
            return;
        }

        Config::set('database.default', 'mysql');
        Config::set('database.connections.mysql.host', env('CLOUDRON_MYSQL_HOST'));
        Config::set('database.connections.mysql.port', env('CLOUDRON_MYSQL_PORT', '3306'));
        Config::set('database.connections.mysql.database', env('CLOUDRON_MYSQL_DATABASE'));
        Config::set('database.connections.mysql.username', env('CLOUDRON_MYSQL_USERNAME'));
        Config::set('database.connections.mysql.password', env('CLOUDRON_MYSQL_PASSWORD'));
    }

    private function mapRedis(): void
    {
        if (! env('CLOUDRON_REDIS_HOST')) {
            return;
        }

        foreach (['default', 'cache'] as $connection) {
            Config::set("database.redis.{$connection}.host", env('CLOUDRON_REDIS_HOST'));
            Config::set("database.redis.{$connection}.port", env('CLOUDRON_REDIS_PORT', '6379'));
            Config::set("database.redis.{$connection}.password", env('CLOUDRON_REDIS_PASSWORD'));
        }

        Config::set('cache.default', 'redis');
        Config::set('queue.default', 'redis');
        Config::set('session.driver', 'redis');
    }

    private function mapMail(): void
    {
        if (! env('CLOUDRON_MAIL_SMTP_SERVER')) {
            return;
        }

        Config::set('mail.default', 'smtp');
        Config::set('mail.mailers.smtp.host', env('CLOUDRON_MAIL_SMTP_SERVER'));
        Config::set('mail.mailers.smtp.port', env('CLOUDRON_MAIL_SMTP_PORT'));
        Config::set('mail.mailers.smtp.username', env('CLOUDRON_MAIL_SMTP_USERNAME'));
        Config::set('mail.mailers.smtp.password', env('CLOUDRON_MAIL_SMTP_PASSWORD'));

        if (env('CLOUDRON_MAIL_FROM')) {
            Config::set('mail.from.address', env('CLOUDRON_MAIL_FROM'));
        }

        if (env('CLOUDRON_MAIL_FROM_DISPLAY_NAME')) {
            Config::set('mail.from.name', env('CLOUDRON_MAIL_FROM_DISPLAY_NAME'));
        }
    }

    private function mapAppOrigin(): void
    {
        // CLOUDRON_APP_ORIGIN is the canonical https origin Cloudron has
        // provisioned for this app. Prefer it over a hand-maintained
        // APP_URL so redirects, signed links, and asset URLs stay correct
        // if the app is ever moved between beta and production domains.
        if (env('CLOUDRON_APP_ORIGIN')) {
            Config::set('app.url', env('CLOUDRON_APP_ORIGIN'));
        }
    }
}
