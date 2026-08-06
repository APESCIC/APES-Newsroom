<?php

namespace App\Console\Commands;

use App\Enums\PostStatus;
use App\Enums\Role;
use App\Models\Post;
use App\Models\User;
use App\Services\Mailing\CampaignService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PublishScheduledPostsCommand extends Command
{
    protected $signature = 'posts:publish-scheduled';

    protected $description = 'Publish posts whose scheduled_for time has passed (Europe/London)';

    public function __construct(private readonly CampaignService $campaigns)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $posts = Post::query()
            ->where('status', PostStatus::Scheduled)
            ->whereNotNull('scheduled_for')
            ->where('scheduled_for', '<=', now('Europe/London'))
            ->get();

        $systemActor = User::query()
            ->where('role', Role::SuperAdmin)
            ->orderBy('id')
            ->first()
            ?? User::query()->where('role', Role::Admin)->orderBy('id')->first();

        foreach ($posts as $post) {
            DB::transaction(function () use ($post, $systemActor) {
                $post->update([
                    'status' => PostStatus::Published,
                    'published_at' => $post->scheduled_for,
                    'scheduled_for' => null,
                ]);

                if ($systemActor) {
                    $this->campaigns->createFromPublishedPost($post->fresh(), $systemActor);
                }
            });

            $this->line("Published: {$post->title}");
        }

        $this->info("Published {$posts->count()} scheduled post(s).");

        return self::SUCCESS;
    }
}
