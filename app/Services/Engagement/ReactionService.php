<?php

namespace App\Services\Engagement;

use App\Enums\ReactionType;
use App\Models\Post;
use App\Models\Reaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReactionService
{
    public function __construct(private readonly CommentService $comments) {}

    /**
     * Toggle a reaction. Returns whether the reaction is now active.
     */
    public function toggle(User $user, Post $post, ReactionType $type): bool
    {
        $this->comments->assertCanInteract($user);

        return DB::transaction(function () use ($user, $post, $type) {
            $existing = Reaction::query()
                ->where('user_id', $user->id)
                ->where('post_id', $post->id)
                ->where('type', $type->value)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                $existing->delete();

                return false;
            }

            Reaction::query()->firstOrCreate([
                'user_id' => $user->id,
                'post_id' => $post->id,
                'type' => $type->value,
            ]);

            return true;
        });
    }

    /**
     * @return array{helpful: int, support: int, thank_you: int, mine: list<string>}
     */
    public function countsForPost(Post $post, ?User $viewer = null): array
    {
        $counts = [
            ReactionType::Helpful->value => 0,
            ReactionType::Support->value => 0,
            ReactionType::ThankYou->value => 0,
        ];

        $rows = Reaction::query()
            ->where('post_id', $post->id)
            ->selectRaw('type, count(*) as aggregate')
            ->groupBy('type')
            ->pluck('aggregate', 'type');

        foreach ($rows as $type => $count) {
            if (array_key_exists($type, $counts)) {
                $counts[$type] = (int) $count;
            }
        }

        $mine = [];
        if ($viewer) {
            $mine = Reaction::query()
                ->where('post_id', $post->id)
                ->where('user_id', $viewer->id)
                ->pluck('type')
                ->map(fn ($t) => $t instanceof ReactionType ? $t->value : (string) $t)
                ->all();
        }

        return [
            'helpful' => $counts[ReactionType::Helpful->value],
            'support' => $counts[ReactionType::Support->value],
            'thank_you' => $counts[ReactionType::ThankYou->value],
            'mine' => $mine,
        ];
    }
}
