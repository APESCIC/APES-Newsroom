<?php

namespace Tests\Feature;

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffPostTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_create_a_draft(): void
    {
        $staff = User::factory()->staff()->create();

        $response = $this->actingAs($staff)->post('/staff/posts', [
            'title' => 'Test Article',
            'slug' => 'test-article',
            'excerpt' => 'An excerpt',
            'channel' => 'apes_cic',
            'content' => [
                'blocks' => [['type' => 'paragraph', 'data' => ['text' => 'Body text']]],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', ['slug' => 'test-article', 'status' => PostStatus::Draft->value]);
    }

    public function test_public_user_cannot_access_staff_posts(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/staff/posts')->assertForbidden();
    }

    public function test_admin_can_publish_post(): void
    {
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->create(['author_id' => $admin->id]);

        $this->actingAs($admin)->post("/staff/posts/{$post->id}/publish")->assertRedirect();

        $this->assertSame(PostStatus::Published, $post->fresh()->status);
    }
}
