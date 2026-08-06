<?php

namespace Tests\Feature;

use App\Enums\PostStatus;
use App\Models\AuditLog;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthzMatrixTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_cannot_access_staff_or_admin(): void
    {
        $public = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($public)->get('/staff/posts')->assertForbidden();
        $this->actingAs($public)->get('/admin/moderation')->assertForbidden();
        $this->actingAs($public)->post("/staff/posts/{$post->id}/publish")->assertForbidden();
    }

    public function test_staff_can_edit_own_draft_but_not_publish(): void
    {
        $staff = User::factory()->staff()->create();
        $own = Post::factory()->create(['author_id' => $staff->id]);
        $other = Post::factory()->create();

        $this->actingAs($staff)->get("/staff/posts/{$own->id}/edit")->assertOk();
        $this->actingAs($staff)->get("/staff/posts/{$other->id}/edit")->assertForbidden();
        $this->actingAs($staff)->post("/staff/posts/{$own->id}/publish")->assertForbidden();
        $this->actingAs($staff)->get('/admin/moderation')->assertForbidden();
    }

    public function test_admin_publish_writes_audit_log(): void
    {
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->create([
            'author_id' => $admin->id,
            'status' => PostStatus::InReview,
        ]);

        $this->actingAs($admin)->post("/staff/posts/{$post->id}/publish")->assertRedirect();

        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $admin->id,
            'action' => 'post.published',
            'subject_id' => $post->id,
        ]);
        $this->assertInstanceOf(AuditLog::class, AuditLog::query()->where('action', 'post.published')->first());
    }

    public function test_security_headers_are_present(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Content-Security-Policy');
    }
}
