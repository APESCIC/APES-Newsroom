<?php

namespace App\Http\Controllers;

use App\Enums\ReactionType;
use App\Models\Post;
use App\Services\Engagement\ReactionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReactionController extends Controller
{
    public function __construct(private readonly ReactionService $reactions) {}

    public function toggle(Request $request, string $slug): RedirectResponse
    {
        $post = Post::published()->where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'type' => ['required', Rule::enum(ReactionType::class)],
        ]);

        $this->reactions->toggle(
            $request->user(),
            $post,
            ReactionType::from($validated['type']),
        );

        return back();
    }
}
