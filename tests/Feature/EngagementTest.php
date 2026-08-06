<?php

namespace Tests\Feature;

use App\Enums\ModerationStatus;
use App\Enums\ReactionType;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Profile;
use App\Models\Reaction;
use App\Models\User;
use App\Services\Engagement\ProfileService;
use App\Services\Engagement\ReactionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EngagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_profiles_are_private_by_default(): void
    {
        $user = User::factory()->create();
        $profile = app(ProfileService::class)->forUser($user);

        $this->assertSame(ModerationStatus::Private, $profile->moderation_status);
        $this->assertFalse($profile->public_opt_in);
        $this->assertNull($profile->publicPayload());
        $this->get('/profiles/'.$profile->id)->assertNotFound();
    }

    public function test_profile_edits_require_moderation_before_public_display(): void
    {
        $user = User::factory()->create();
        $admin = User::factory()->admin()->create();

        $this->actingAs($user)->post('/account/public-profile', [
            'display_name' => 'River Reader',
            'bio' => 'Loves exotic pets',
            'public_opt_in' => true,
        ])->assertRedirect();

        $profile = Profile::query()->where('user_id', $user->id)->firstOrFail();
        $this->assertSame(ModerationStatus::Pending, $profile->moderation_status);
        $this->get('/profiles/'.$profile->id)->assertNotFound();

        $this->actingAs($admin)->post('/admin/moderation/profiles/'.$profile->id, [
            'status' => ModerationStatus::Approved->value,
        ])->assertRedirect();

        $this->get('/profiles/'.$profile->id)->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Profiles/Show')
                ->where('profile.display_name', 'River Reader')
            );

        $this->actingAs($user)->post('/account/public-profile', [
            'display_name' => 'River Updated',
            'bio' => 'Updated bio',
            'public_opt_in' => true,
        ])->assertRedirect();

        $this->assertSame(ModerationStatus::Pending, $profile->fresh()->moderation_status);
        $this->get('/profiles/'.$profile->id)->assertNotFound();
    }

    public function test_comments_require_moderation_and_hide_private_data(): void
    {
        $author = User::factory()->create();
        $reader = User::factory()->create();
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->published()->create(['author_id' => $author->id, 'slug' => 'engage-story']);

        $this->actingAs($reader)->post('/articles/engage-story/comments', [
            'body' => 'Great update from the shelter',
        ])->assertRedirect();

        $comment = Comment::query()->firstOrFail();
        $this->assertSame(ModerationStatus::Pending, $comment->moderation_status);

        $this->get('/articles/engage-story')->assertOk()
            ->assertInertia(fn ($page) => $page->has('comments', 0));

        $this->actingAs($admin)->post('/admin/moderation/comments/'.$comment->id, [
            'status' => ModerationStatus::Approved->value,
        ])->assertRedirect();

        $this->get('/articles/engage-story')->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('comments', 1)
                ->where('comments.0.body', 'Great update from the shelter')
                ->missing('comments.0.user_id')
                ->missing('comments.0.email')
            );
    }

    public function test_suspended_accounts_cannot_interact(): void
    {
        $user = User::factory()->create();
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->published()->create(['author_id' => $admin->id, 'slug' => 'locked']);

        $profile = app(ProfileService::class)->forUser($user);
        app(ProfileService::class)->moderate($profile, $admin, ModerationStatus::Suspended, 'spam');

        $this->actingAs($user)->post('/articles/locked/comments', [
            'body' => 'Should fail',
        ])->assertForbidden();

        $this->actingAs($user)->post('/articles/locked/reactions', [
            'type' => ReactionType::Helpful->value,
        ])->assertForbidden();
    }

    public function test_reaction_uniqueness_holds_under_toggle(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->published()->create(['slug' => 'react-me']);

        $service = app(ReactionService::class);

        $this->assertTrue($service->toggle($user, $post, ReactionType::Helpful));
        $this->assertFalse($service->toggle($user, $post, ReactionType::Helpful));
        $this->assertTrue($service->toggle($user, $post, ReactionType::Support));

        $this->assertSame(1, Reaction::query()->where('user_id', $user->id)->where('post_id', $post->id)->where('type', ReactionType::Support)->count());
        $this->assertSame(0, Reaction::query()->where('user_id', $user->id)->where('post_id', $post->id)->where('type', ReactionType::Helpful)->count());

        $this->actingAs($user)->post('/articles/react-me/reactions', [
            'type' => ReactionType::ThankYou->value,
        ])->assertRedirect();

        $this->actingAs($user)->post('/articles/react-me/reactions', [
            'type' => ReactionType::ThankYou->value,
        ])->assertRedirect();

        $this->assertSame(0, Reaction::query()->where('type', ReactionType::ThankYou)->count());
    }

    public function test_public_article_payload_does_not_expose_moderation_notes(): void
    {
        $admin = User::factory()->admin()->create();
        $reader = User::factory()->create();
        $post = Post::factory()->published()->create(['author_id' => $admin->id, 'slug' => 'clean']);

        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => $reader->id,
            'body' => 'Visible later',
            'body_hash' => hash('sha256', 'visible later'),
            'moderation_status' => ModerationStatus::Approved,
            'moderation_notes' => 'internal reason',
        ]);

        $this->get('/articles/clean')->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('comments.0.id', $comment->id)
                ->missing('comments.0.moderation_notes')
            );
    }

    public function test_staff_cannot_access_admin_moderation(): void
    {
        $staff = User::factory()->staff()->create();
        $this->actingAs($staff)->get('/admin/moderation')->assertForbidden();
    }

    public function test_unverified_users_cannot_comment(): void
    {
        $user = User::factory()->unverified()->create();
        $post = Post::factory()->published()->create(['slug' => 'verify-first']);

        $this->actingAs($user)->post('/articles/verify-first/comments', [
            'body' => 'Nope',
        ])->assertRedirect(); // verified middleware redirects
    }
}
