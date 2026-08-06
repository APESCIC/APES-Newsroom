<?php

namespace Database\Factories;

use App\Enums\Channel;
use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence();

        return [
            'author_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 9999),
            'excerpt' => fake()->paragraph(),
            'content' => [
                'time' => now()->getTimestampMs(),
                'blocks' => [
                    ['type' => 'paragraph', 'data' => ['text' => fake()->paragraph()]],
                ],
                'version' => '2.29.0',
            ],
            'status' => PostStatus::Draft,
            'channel' => Channel::ApesCic,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => PostStatus::Published,
            'published_at' => now()->subDay(),
        ]);
    }
}
