<?php

namespace App\Http\Middleware;

use App\Models\Redirect;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;

class ResolveRedirects
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! in_array($request->method(), ['GET', 'HEAD'], true)) {
            return $next($request);
        }

        if ($request->is('health', 'up', 'sitemap.xml', 'rss.xml')) {
            return $next($request);
        }

        if (! Schema::hasTable('redirects')) {
            return $next($request);
        }

        $path = '/'.ltrim($request->getPathInfo(), '/');
        if ($path !== '/') {
            $path = rtrim($path, '/') ?: '/';
        }

        $redirect = Redirect::query()->where('from_path', $path)->first()
            ?? Redirect::query()->where('from_path', $path.'/')->first();

        if (! $redirect) {
            return $next($request);
        }

        if ((int) $redirect->status_code === 410) {
            abort(410);
        }

        return redirect($redirect->to_path, (int) $redirect->status_code);
    }
}
