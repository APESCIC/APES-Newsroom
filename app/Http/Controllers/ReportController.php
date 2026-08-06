<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\ModerationReport;
use App\Models\Profile;
use App\Services\Engagement\CommentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private readonly CommentService $comments) {}

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user?->hasVerifiedEmail(), 403);

        $this->comments->assertCanInteract($user);

        $validated = $request->validate([
            'type' => ['required', 'in:comment,profile'],
            'id' => ['required', 'integer'],
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $reportable = match ($validated['type']) {
            'comment' => Comment::query()->findOrFail($validated['id']),
            'profile' => Profile::query()->findOrFail($validated['id']),
        };

        ModerationReport::create([
            'reporter_id' => $user->id,
            'reportable_type' => $reportable->getMorphClass(),
            'reportable_id' => $reportable->getKey(),
            'reason' => $validated['reason'],
            'status' => 'open',
        ]);

        return back()->with('status', 'Report submitted for review.');
    }
}
