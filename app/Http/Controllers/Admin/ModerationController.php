<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ModerationStatus;
use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\ModerationReport;
use App\Models\Profile;
use App\Services\Audit\AuditLogger;
use App\Services\Engagement\CommentService;
use App\Services\Engagement\ProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ModerationController extends Controller
{
    public function __construct(
        private readonly ProfileService $profiles,
        private readonly CommentService $comments,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorizeAdmin();

        $pendingProfiles = Profile::query()
            ->where('moderation_status', ModerationStatus::Pending)
            ->with('user:id,name,email')
            ->latest('updated_at')
            ->get()
            ->map(fn (Profile $profile) => [
                'id' => $profile->id,
                'display_name' => $profile->display_name,
                'bio' => $profile->bio,
                'user_name' => $profile->user->name,
                'updated_at' => $profile->updated_at?->toIso8601String(),
            ]);

        $pendingComments = Comment::query()
            ->where('moderation_status', ModerationStatus::Pending)
            ->with(['user:id,name', 'post:id,title,slug'])
            ->latest()
            ->get()
            ->map(fn (Comment $comment) => [
                'id' => $comment->id,
                'body' => $comment->body,
                'user_name' => $comment->user->name,
                'post_title' => $comment->post->title,
                'post_slug' => $comment->post->slug,
                'created_at' => $comment->created_at?->toIso8601String(),
            ]);

        $reports = ModerationReport::query()
            ->where('status', 'open')
            ->with('reporter:id,name')
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (ModerationReport $report) => [
                'id' => $report->id,
                'reason' => $report->reason,
                'reportable_type' => class_basename($report->reportable_type),
                'reportable_id' => $report->reportable_id,
                'reporter' => $report->reporter?->name,
                'created_at' => $report->created_at?->toIso8601String(),
            ]);

        $suspendedProfiles = Profile::query()
            ->where('moderation_status', ModerationStatus::Suspended)
            ->with('user:id,name')
            ->latest('moderated_at')
            ->get()
            ->map(fn (Profile $profile) => [
                'id' => $profile->id,
                'display_name' => $profile->display_name,
                'user_name' => $profile->user->name,
                'notes' => $profile->moderation_notes,
            ]);

        return Inertia::render('Admin/Moderation/Index', [
            'profiles' => $pendingProfiles,
            'comments' => $pendingComments,
            'reports' => $reports,
            'suspended' => $suspendedProfiles,
        ]);
    }

    public function moderateProfile(Request $request, Profile $profile): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'status' => ['required', Rule::in([
                ModerationStatus::Approved->value,
                ModerationStatus::Rejected->value,
                ModerationStatus::Suspended->value,
                ModerationStatus::Private->value,
            ])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $this->profiles->moderate(
            $profile,
            $request->user(),
            ModerationStatus::from($validated['status']),
            $validated['notes'] ?? null,
        );

        $this->audit->record($request->user(), 'profile.moderated', $profile, [
            'status' => $validated['status'],
        ], $request);

        return back();
    }

    public function moderateComment(Request $request, Comment $comment): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'status' => ['required', Rule::in([
                ModerationStatus::Approved->value,
                ModerationStatus::Rejected->value,
            ])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $this->comments->moderate(
            $comment,
            $request->user(),
            ModerationStatus::from($validated['status']),
            $validated['notes'] ?? null,
        );

        $this->audit->record($request->user(), 'comment.moderated', $comment, [
            'status' => $validated['status'],
        ], $request);

        return back();
    }

    public function resolveReport(Request $request, ModerationReport $report): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'status' => ['required', Rule::in(['resolved', 'dismissed'])],
        ]);

        $report->update(['status' => $validated['status']]);

        $this->audit->record($request->user(), 'report.resolved', $report, [
            'status' => $validated['status'],
        ], $request);

        return back();
    }

    public function restoreComment(Request $request, int $comment): RedirectResponse
    {
        $this->authorizeAdmin();

        $model = Comment::withTrashed()->findOrFail($comment);

        if ($model->trashed()) {
            $model->restore();
        }

        $model->update([
            'moderation_status' => ModerationStatus::Approved,
            'moderated_by' => $request->user()->id,
            'moderated_at' => now(),
        ]);

        $this->audit->record($request->user(), 'comment.restored', $model, [], $request);

        return back();
    }

    private function authorizeAdmin(): void
    {
        if (! request()->user()?->role->atLeast(Role::Admin)) {
            abort(403);
        }
    }
}
