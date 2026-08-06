<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\EditorJs\BlockRenderer;
use App\Services\Engagement\CommentService;
use App\Services\Engagement\ReactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function show(
        Request $request,
        string $slug,
        BlockRenderer $renderer,
        CommentService $comments,
        ReactionService $reactions,
    ): Response {
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
            'comments' => $comments->approvedPayloadForPost($post),
            'reactions' => $reactions->countsForPost($post, $request->user()),
            'canEngage' => $request->user()?->hasVerifiedEmail() ?? false,
            'preview' => false,
            'status' => session('status'),
        ]);
    }
}
