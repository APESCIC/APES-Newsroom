<?php

namespace App\Services\Engagement;

use App\Enums\ModerationStatus;
use App\Models\Comment;
use App\Models\ModerationAudit;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CommentService
{
    public const MAX_LENGTH = 2000;

    public function __construct(private readonly ProfileService $profiles) {}

    public function create(User $user, Post $post, string $body): Comment
    {
        $this->assertCanInteract($user);

        $clean = $this->sanitize($body);
        $hash = hash('sha256', Str::lower($clean));

        $duplicate = Comment::query()
            ->where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->where('body_hash', $hash)
            ->where('created_at', '>=', now()->subMinutes(10))
            ->exists();

        if ($duplicate) {
            throw ValidationException::withMessages([
                'body' => 'Duplicate comment detected. Please wait before posting the same text again.',
            ]);
        }

        $recentCount = Comment::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', now()->subMinute())
            ->count();

        if ($recentCount >= 3) {
            throw ValidationException::withMessages([
                'body' => 'Comment rate limit exceeded. Please wait a moment.',
            ]);
        }

        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'body' => $clean,
            'body_hash' => $hash,
            'moderation_status' => ModerationStatus::Pending,
        ]);

        $this->audit($user->id, $comment, 'comment_created');

        return $comment;
    }

    public function update(User $user, Comment $comment, string $body): Comment
    {
        $this->assertCanInteract($user);

        if ($comment->user_id !== $user->id) {
            abort(403);
        }

        $clean = $this->sanitize($body);

        $comment->update([
            'body' => $clean,
            'body_hash' => hash('sha256', Str::lower($clean)),
            'moderation_status' => ModerationStatus::Pending,
            'moderation_notes' => null,
            'moderated_by' => null,
            'moderated_at' => null,
        ]);

        $this->audit($user->id, $comment, 'comment_edited');

        return $comment->fresh();
    }

    public function moderate(Comment $comment, User $moderator, ModerationStatus $status, ?string $notes = null): Comment
    {
        $comment->update([
            'moderation_status' => $status,
            'moderation_notes' => $notes,
            'moderated_by' => $moderator->id,
            'moderated_at' => now(),
        ]);

        $this->audit($moderator->id, $comment, 'comment_moderated', [
            'status' => $status->value,
            'notes' => $notes,
        ]);

        return $comment->fresh();
    }

    /**
     * @return list<array{id: int, body: string, created_at: string|null, author: array{display_name: string, avatar_url: string|null}|null}>
     */
    public function approvedPayloadForPost(Post $post): array
    {
        return Comment::query()
            ->where('post_id', $post->id)
            ->where('moderation_status', ModerationStatus::Approved)
            ->with(['user.profile'])
            ->latest()
            ->get()
            ->map(function (Comment $comment) {
                $profile = $comment->user->profile;
                $public = $profile?->publicPayload();

                return [
                    'id' => $comment->id,
                    'body' => $comment->body,
                    'created_at' => $comment->created_at?->toIso8601String(),
                    'author' => $public ? [
                        'display_name' => $public['display_name'],
                        'avatar_url' => $public['avatar_url'],
                    ] : [
                        'display_name' => 'APES reader',
                        'avatar_url' => null,
                    ],
                ];
            })
            ->all();
    }

    public function assertCanInteract(User $user): void
    {
        if (! $user->hasVerifiedEmail()) {
            abort(403, 'Verified account required.');
        }

        $profile = $this->profiles->forUser($user);
        if ($profile->moderation_status === ModerationStatus::Suspended) {
            abort(403, 'Account suspended from engagement.');
        }
    }

    private function sanitize(string $body): string
    {
        $clean = trim(strip_tags($body));
        $clean = preg_replace('/https?:\/\/\S+/i', '', $clean) ?? $clean;
        $clean = preg_replace('/\s+/', ' ', $clean) ?? $clean;
        $clean = trim($clean);

        if ($clean === '' || mb_strlen($clean) > self::MAX_LENGTH) {
            throw ValidationException::withMessages([
                'body' => 'Comment must be between 1 and '.self::MAX_LENGTH.' characters without links.',
            ]);
        }

        return $clean;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function audit(?int $actorId, Comment $comment, string $action, array $payload = []): void
    {
        ModerationAudit::create([
            'actor_id' => $actorId,
            'subject_type' => Comment::class,
            'subject_id' => $comment->id,
            'action' => $action,
            'payload' => $payload === [] ? null : $payload,
            'created_at' => now(),
        ]);
    }
}
