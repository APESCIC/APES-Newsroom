<?php

namespace App\Models;

use App\Enums\ModerationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id', 'display_name', 'bio', 'avatar_path', 'moderation_status',
    'moderation_notes', 'moderated_by', 'moderated_at', 'public_opt_in',
])]
class Profile extends Model
{
    protected function casts(): array
    {
        return [
            'moderation_status' => ModerationStatus::class,
            'moderated_at' => 'datetime',
            'public_opt_in' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isPubliclyVisible(): bool
    {
        return $this->public_opt_in
            && $this->moderation_status === ModerationStatus::Approved;
    }

    /**
     * @return array{display_name: string, bio: string|null, avatar_url: string|null}|null
     */
    public function publicPayload(): ?array
    {
        if (! $this->isPubliclyVisible()) {
            return null;
        }

        return [
            'display_name' => $this->display_name ?? 'APES reader',
            'bio' => $this->bio,
            'avatar_url' => $this->avatar_path ? url('/storage/'.$this->avatar_path) : null,
        ];
    }
}
