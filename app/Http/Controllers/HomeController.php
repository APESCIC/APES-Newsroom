<?php

namespace App\Http\Controllers;

use App\Enums\Channel;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $posts = Post::published()
            ->with('author')
            ->latest('published_at')
            ->limit(12)
            ->get()
            ->map(fn (Post $post) => $this->cardPayload($post));

        $featured = $posts->first();

        return Inertia::render('home', [
            'featured' => $featured,
            'recent' => $posts->skip(1)->values(),
            'channels' => collect(Channel::cases())->map(fn (Channel $c) => [
                'slug' => $c->slug(),
                'label' => $c->label(),
            ]),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function cardPayload(Post $post): array
    {
        return [
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'channel' => $post->channel->label(),
            'channel_slug' => $post->channel->slug(),
            'author' => $post->author->name,
            'published_at' => $post->published_at?->toIso8601String(),
            'hero_image' => $post->hero_image,
            'hero_image_alt' => $post->hero_image_alt,
        ];
    }
}
