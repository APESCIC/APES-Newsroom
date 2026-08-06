<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Lightweight helpers for Editor.js image-by-URL and link meta (issue #5).
 */
class MediaController extends Controller
{
    public function byUrl(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => ['required', 'url', 'max:2048'],
        ]);

        return response()->json([
            'success' => 1,
            'file' => [
                'url' => $validated['url'],
            ],
        ]);
    }

    public function linkMeta(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => ['required', 'url', 'max:2048'],
        ]);

        $host = parse_url($validated['url'], PHP_URL_HOST) ?: $validated['url'];

        return response()->json([
            'success' => 1,
            'meta' => [
                'title' => $host,
            ],
        ]);
    }
}
