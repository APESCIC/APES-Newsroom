<?php

namespace App\Models;

use App\Enums\ModerationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'post_id', 'user_id', 'body', 'moderation_status', 'moderation_notes',
    'moderated_by', 'moderated_at', 'body_hash',
])]
class Comment extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'moderation_status' => ModerationStatus::class,
            'moderated_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Post, $this>
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
