<?php

namespace Tests\Feature;

use App\Enums\PostStatus;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublishScheduledPostsCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_scheduled_posts_are_published_when_due(): void
    {
        $post = Post::factory()->create([
            'status' => PostStatus::Scheduled,
            'scheduled_for' => now('Europe/London')->subMinute(),
        ]);

        $this->artisan('posts:publish-scheduled')->assertSuccessful();

        $post->refresh();
        $this->assertSame(PostStatus::Published, $post->status);
        $this->assertNotNull($post->published_at);
    }
}
