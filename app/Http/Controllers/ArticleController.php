<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\EditorJs\BlockRenderer;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function show(string $slug, BlockRenderer $renderer): Response
    {
        $post = Post::published()
            ->where('slug', $slug)
            ->with('author', 'tags')
            ->firstOrFail();

        return Inertia::render('Articles/Show', [
            'article' => [
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'html' => $renderer->toHtml($post->content),
                'channel' => $post->channel->label(),
                'channel_slug' => $post->channel->slug(),
                'author' => $post->author->name,
                'published_at' => $post->published_at?->toIso8601String(),
                'meta_title' => $post->meta_title ?? $post->title,
                'meta_description' => $post->meta_description ?? $post->excerpt,
                'tags' => $post->tags->pluck('name'),
            ],
            'preview' => false,
        ]);
    }
}
