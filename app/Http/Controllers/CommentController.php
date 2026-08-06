<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Services\Engagement\CommentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(private readonly CommentService $comments) {}

    public function store(Request $request, string $slug): RedirectResponse
    {
        $post = Post::published()->where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $this->comments->create($request->user(), $post, $validated['body']);

        return back()->with('status', 'comment-pending');
    }

    public function update(Request $request, Comment $comment): RedirectResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $this->comments->update($request->user(), $comment, $validated['body']);

        return back()->with('status', 'comment-pending');
    }
}
