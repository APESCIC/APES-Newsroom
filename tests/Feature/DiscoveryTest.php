<?php

namespace Tests\Feature;

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\Redirect;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiscoveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_author_archive_lists_published_posts(): void
    {
        $author = User::factory()->staff()->create(['name' => 'Editor One']);
        Post::factory()->published()->create([
            'author_id' => $author->id,
            'title' => 'Author piece',
        ]);

        $this->get("/authors/{$author->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Archives/Author')
                ->where('author.name', 'Editor One')
                ->has('posts.data', 1));
    }

    public function test_tag_archive_lists_tagged_posts(): void
    {
        $post = Post::factory()->published()->create();
        $tag = Tag::query()->create(['name' => 'Welfare', 'slug' => 'welfare']);
        $post->tags()->attach($tag);

        $this->get('/tags/welfare')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Archives/Tag')
                ->where('tag.slug', 'welfare')
                ->has('posts.data', 1));
    }

    public function test_date_archive_filters_by_year(): void
    {
        Post::factory()->published()->create([
            'published_at' => now()->setDate(2025, 6, 1),
            'status' => PostStatus::Published,
        ]);

        $this->get('/archive/2025')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Archives/Date')
                ->where('year', 2025));
    }

    public function test_redirect_middleware_issues_301(): void
    {
        Redirect::query()->create([
            'from_path' => '/articles/legacy-slug',
            'to_path' => '/articles/new-slug',
            'status_code' => 301,
        ]);

        $this->get('/articles/legacy-slug')->assertRedirect('/articles/new-slug');
    }

    public function test_gone_redirect_returns_410(): void
    {
        Redirect::query()->create([
            'from_path' => '/articles/removed',
            'to_path' => '/',
            'status_code' => 410,
        ]);

        $this->get('/articles/removed')->assertStatus(410);
    }

    public function test_unknown_page_renders_branded_404(): void
    {
        $this->get('/definitely-missing-page-xyz')
            ->assertStatus(404)
            ->assertInertia(fn ($page) => $page->component('Errors/Show'));
    }
}
