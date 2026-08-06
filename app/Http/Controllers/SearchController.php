<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(Request $request): Response
    {
        $query = (string) $request->query('q', '');

        $posts = collect();

        if ($query !== '') {
            $posts = Post::published()
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                        ->orWhere('excerpt', 'like', "%{$query}%");
                })
                ->latest('published_at')
                ->limit(20)
                ->get()
                ->map(fn (Post $post) => [
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'published_at' => $post->published_at?->toIso8601String(),
                ]);
        }

        return Inertia::render('Search/Index', [
            'query' => $query,
            'results' => $posts,
        ]);
    }
}
