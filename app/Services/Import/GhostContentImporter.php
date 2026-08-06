<?php

namespace App\Services\Import;

use App\Enums\Channel;
use App\Enums\PostStatus;
use App\Enums\Role;
use App\Models\ImportRun;
use App\Models\Post;
use App\Models\Redirect;
use App\Models\Tag;
use App\Models\User;
use App\Services\EditorJs\BlockValidator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use RuntimeException;

class GhostContentImporter
{
    public function __construct(
        private readonly GhostHtmlConverter $converter,
        private readonly BlockValidator $validator,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function import(string $jsonPath, ?string $mediaPath = null, bool $dryRun = true, ?User $actor = null): array
    {
        // Hard guard: imports must never trigger outbound mail.
        Mail::fake();

        if (! is_file($jsonPath)) {
            throw new RuntimeException("Ghost content export not found: {$jsonPath}");
        }

        $checksum = hash_file('sha256', $jsonPath);
        $payload = json_decode(File::get($jsonPath), true);
        if (! is_array($payload)) {
            throw new RuntimeException('Ghost content export is not valid JSON.');
        }

        $data = $this->extractData($payload);
        $run = ImportRun::create([
            'type' => 'ghost_content',
            'status' => 'running',
            'dry_run' => $dryRun,
            'source_path' => $jsonPath,
            'source_checksum' => $checksum,
            'actor_id' => $actor?->id,
            'started_at' => now(),
        ]);

        $report = [
            'posts' => ['seen' => 0, 'created' => 0, 'updated' => 0, 'skipped' => 0],
            'tags' => ['seen' => 0, 'created' => 0, 'updated' => 0],
            'authors' => ['seen' => 0, 'mapped' => 0, 'created' => 0],
            'media' => ['copied' => 0, 'missing' => 0],
            'redirects' => ['created' => 0, 'collisions' => 0, 'loops' => 0],
            'needs_review' => [],
            'warnings' => [],
        ];

        try {
            $authorMap = $this->importAuthors($data['users'] ?? [], $dryRun, $report);
            $tagMap = $this->importTags($data['tags'] ?? [], $dryRun, $report);
            $this->importPosts(
                $data['posts'] ?? [],
                $data['posts_tags'] ?? [],
                $data['posts_authors'] ?? [],
                $authorMap,
                $tagMap,
                $mediaPath,
                $dryRun,
                $report,
            );
            $this->importRedirects($data['redirects'] ?? [], $dryRun, $report);

            $run->update([
                'status' => 'completed',
                'report' => $report,
                'finished_at' => now(),
            ]);
        } catch (\Throwable $e) {
            $report['warnings'][] = $e->getMessage();
            $run->update([
                'status' => 'failed',
                'report' => $report,
                'finished_at' => now(),
            ]);
            throw $e;
        }

        return $report;
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function extractData(array $payload): array
    {
        if (isset($payload['db'][0]['data']) && is_array($payload['db'][0]['data'])) {
            return $payload['db'][0]['data'];
        }

        if (isset($payload['data']) && is_array($payload['data'])) {
            return $payload['data'];
        }

        return $payload;
    }

    /**
     * @param  list<array<string, mixed>>  $users
     * @param  array<string, mixed>  $report
     * @return array<string, int> ghost user id => local user id
     */
    private function importAuthors(array $users, bool $dryRun, array &$report): array
    {
        $map = [];

        foreach ($users as $user) {
            $ghostId = (string) ($user['id'] ?? '');
            if ($ghostId === '') {
                continue;
            }

            $report['authors']['seen']++;
            $email = strtolower((string) ($user['email'] ?? "ghost-{$ghostId}@import.local"));
            $name = (string) ($user['name'] ?? $user['slug'] ?? 'Imported author');

            $existing = User::query()->where('email', $email)->first();
            if ($existing) {
                $map[$ghostId] = $existing->id;
                $report['authors']['mapped']++;

                continue;
            }

            if ($dryRun) {
                $map[$ghostId] = 0;
                $report['authors']['created']++;

                continue;
            }

            $created = User::query()->create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt(Str::random(32)),
                'role' => Role::Staff,
                'email_verified_at' => now(),
            ]);
            $map[$ghostId] = $created->id;
            $report['authors']['created']++;
        }

        return $map;
    }

    /**
     * @param  list<array<string, mixed>>  $tags
     * @param  array<string, mixed>  $report
     * @return array<string, int>
     */
    private function importTags(array $tags, bool $dryRun, array &$report): array
    {
        $map = [];

        foreach ($tags as $tag) {
            $ghostId = (string) ($tag['id'] ?? '');
            if ($ghostId === '') {
                continue;
            }

            $report['tags']['seen']++;
            $name = (string) ($tag['name'] ?? 'Untitled');
            $slug = Str::slug((string) ($tag['slug'] ?? $name));

            $existing = Tag::query()->where('ghost_id', $ghostId)->orWhere('slug', $slug)->first();
            if ($existing) {
                if (! $dryRun) {
                    $existing->update([
                        'ghost_id' => $ghostId,
                        'name' => $name,
                        'slug' => $slug,
                    ]);
                    $report['tags']['updated']++;
                }
                $map[$ghostId] = $existing->id;

                continue;
            }

            if ($dryRun) {
                $map[$ghostId] = 0;
                $report['tags']['created']++;

                continue;
            }

            $created = Tag::query()->create([
                'ghost_id' => $ghostId,
                'name' => $name,
                'slug' => $slug,
            ]);
            $map[$ghostId] = $created->id;
            $report['tags']['created']++;
        }

        return $map;
    }

    /**
     * @param  list<array<string, mixed>>  $posts
     * @param  list<array<string, mixed>>  $postsTags
     * @param  list<array<string, mixed>>  $postsAuthors
     * @param  array<string, int>  $authorMap
     * @param  array<string, int>  $tagMap
     * @param  array<string, mixed>  $report
     */
    private function importPosts(
        array $posts,
        array $postsTags,
        array $postsAuthors,
        array $authorMap,
        array $tagMap,
        ?string $mediaPath,
        bool $dryRun,
        array &$report,
    ): void {
        $tagsByPost = [];
        foreach ($postsTags as $row) {
            $tagsByPost[(string) ($row['post_id'] ?? '')][] = (string) ($row['tag_id'] ?? '');
        }

        $authorsByPost = [];
        foreach ($postsAuthors as $row) {
            $authorsByPost[(string) ($row['post_id'] ?? '')][] = (string) ($row['author_id'] ?? '');
        }

        $fallbackAuthorId = User::query()->whereIn('role', [Role::Admin, Role::Staff, Role::SuperAdmin])->value('id');
        if (! $fallbackAuthorId) {
            $fallbackAuthorId = User::query()->create([
                'name' => 'Import Fallback',
                'email' => 'import-fallback@apes.local',
                'password' => bcrypt(Str::random(32)),
                'role' => Role::Staff,
                'email_verified_at' => now(),
            ])->id;
        }

        foreach ($posts as $post) {
            $ghostId = (string) ($post['id'] ?? '');
            if ($ghostId === '' || ($post['type'] ?? 'post') === 'page' && ($post['status'] ?? '') === 'draft' && empty($post['slug'])) {
                // Still import pages when they have a slug.
            }
            if ($ghostId === '') {
                continue;
            }

            $report['posts']['seen']++;
            $slug = Str::slug((string) ($post['slug'] ?? $post['title'] ?? $ghostId));
            $html = (string) ($post['html'] ?? '');
            $converted = $this->converter->convert($html);

            if ($mediaPath) {
                $converted['blocks'] = $this->rewriteMedia($converted['blocks'], $mediaPath, $report);
            }

            $document = $this->validator->validate([
                'time' => now()->getTimestampMs(),
                'blocks' => $converted['blocks'],
                'version' => '2.29.0',
            ]);

            $authorGhostId = $authorsByPost[$ghostId][0] ?? null;
            $authorId = ($authorGhostId && ($authorMap[$authorGhostId] ?? 0) > 0)
                ? $authorMap[$authorGhostId]
                : $fallbackAuthorId;

            $status = match ((string) ($post['status'] ?? 'draft')) {
                'published' => PostStatus::Published,
                'scheduled' => PostStatus::Scheduled,
                default => PostStatus::Draft,
            };

            $channel = $this->detectChannel($post);
            $attrs = [
                'ghost_id' => $ghostId,
                'author_id' => $authorId,
                'title' => (string) ($post['title'] ?? 'Untitled'),
                'slug' => $slug,
                'excerpt' => (string) ($post['custom_excerpt'] ?? $post['excerpt'] ?? ''),
                'content' => $document,
                'status' => $status,
                'channel' => $channel,
                'hero_image' => $post['feature_image'] ?? null,
                'meta_title' => $post['meta_title'] ?? null,
                'meta_description' => $post['meta_description'] ?? null,
                'canonical_url' => $post['canonical_url'] ?? null,
                'published_at' => ! empty($post['published_at']) ? $post['published_at'] : null,
                'email_on_publish' => false,
                'mailing_lists' => [],
                'needs_import_review' => $converted['needs_review'],
            ];

            if ($converted['needs_review']) {
                $report['needs_review'][] = $slug;
            }

            $existing = Post::withTrashed()->where('ghost_id', $ghostId)->orWhere('slug', $slug)->first();

            if ($dryRun) {
                if ($existing) {
                    $report['posts']['updated']++;
                } else {
                    $report['posts']['created']++;
                }

                continue;
            }

            DB::transaction(function () use ($existing, $attrs, $tagsByPost, $ghostId, $tagMap, $slug, &$report) {
                if ($existing) {
                    $oldSlug = $existing->slug;
                    $existing->fill($attrs)->save();
                    $postModel = $existing;
                    $report['posts']['updated']++;
                    if ($oldSlug !== $slug && $postModel->status === PostStatus::Published) {
                        Redirect::query()->updateOrCreate(
                            ['from_path' => '/articles/'.$oldSlug],
                            ['to_path' => '/articles/'.$slug, 'status_code' => 301],
                        );
                        $report['redirects']['created']++;
                    }
                } else {
                    $postModel = Post::query()->create($attrs);
                    $report['posts']['created']++;
                }

                $tagIds = [];
                foreach ($tagsByPost[$ghostId] ?? [] as $tagGhostId) {
                    if (($tagMap[$tagGhostId] ?? 0) > 0) {
                        $tagIds[] = $tagMap[$tagGhostId];
                    }
                }
                $postModel->tags()->sync(array_unique($tagIds));

                // Preserve legacy Ghost path as redirect to new article URL.
                Redirect::query()->updateOrCreate(
                    ['from_path' => '/'.$slug.'/'],
                    ['to_path' => '/articles/'.$slug, 'status_code' => 301],
                );
                $report['redirects']['created']++;
            });
        }
    }

    /**
     * @param  list<array<string, mixed>>  $blocks
     * @param  array<string, mixed>  $report
     * @return list<array<string, mixed>>
     */
    private function rewriteMedia(array $blocks, string $mediaPath, array &$report): array
    {
        foreach ($blocks as &$block) {
            if (($block['type'] ?? '') !== 'image') {
                continue;
            }

            $url = (string) ($block['data']['file']['url'] ?? '');
            $path = parse_url($url, PHP_URL_PATH) ?: $url;
            $basename = basename((string) $path);
            $source = rtrim($mediaPath, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$basename;

            if (! is_file($source)) {
                $report['media']['missing']++;
                $report['warnings'][] = "Missing media: {$basename}";

                continue;
            }

            $destDir = storage_path('app/public/imports');
            File::ensureDirectoryExists($destDir);
            $dest = $destDir.DIRECTORY_SEPARATOR.$basename;
            if (! is_file($dest)) {
                File::copy($source, $dest);
            }
            $block['data']['file']['url'] = '/storage/imports/'.$basename;
            $report['media']['copied']++;
        }

        return $blocks;
    }

    /**
     * @param  list<array<string, mixed>>  $redirects
     * @param  array<string, mixed>  $report
     */
    private function importRedirects(array $redirects, bool $dryRun, array &$report): void
    {
        $seen = [];

        foreach ($redirects as $row) {
            $from = '/'.ltrim((string) ($row['from'] ?? $row['from_path'] ?? ''), '/');
            $to = '/'.ltrim((string) ($row['to'] ?? $row['to_path'] ?? ''), '/');
            if ($from === '/' || $to === '/' || $from === $to) {
                $report['redirects']['loops']++;

                continue;
            }

            if (isset($seen[$from])) {
                $report['redirects']['collisions']++;

                continue;
            }
            $seen[$from] = $to;

            if ($dryRun) {
                $report['redirects']['created']++;

                continue;
            }

            Redirect::query()->updateOrCreate(
                ['from_path' => $from],
                ['to_path' => $to, 'status_code' => (int) ($row['status_code'] ?? 301)],
            );
            $report['redirects']['created']++;
        }
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function detectChannel(array $post): Channel
    {
        $haystack = strtolower(($post['primary_tag']['slug'] ?? '').' '.($post['slug'] ?? '').' '.($post['title'] ?? ''));

        if (str_contains($haystack, 'shelter') || str_contains($haystack, 'rescue')) {
            return Channel::ApesShelterRescue;
        }

        if (str_contains($haystack, 'clinic') || str_contains($haystack, 'pet-care')) {
            return Channel::ApesPetCareClinic;
        }

        return Channel::ApesCic;
    }
}
