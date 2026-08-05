<?php

use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        // Laravel's built-in readiness probe (boots the framework only).
        // The richer /health endpoint below additionally verifies DB and
        // Redis connectivity, per issue #3's "safe application readiness"
        // requirement, without exposing configuration or secrets.
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        // Cloudron terminates TLS and proxies requests from a single,
        // known internal address (CLOUDRON_PROXY_IP). Trust only that
        // address so X-Forwarded-* headers (scheme, host, client IP)
        // are honoured without trusting arbitrary upstream proxies.
        $middleware->trustProxies(at: array_filter([env('CLOUDRON_PROXY_IP')]));

        $middleware->alias([
            'role' => EnsureRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
