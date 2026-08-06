<?php

namespace App\Console\Commands;

use App\Enums\PostStatus;
use App\Models\Post;
use Illuminate\Console\Command;

class PublishScheduledPostsCommand extends Command
{
    protected $signature = 'posts:publish-scheduled';

    protected $description = 'Publish posts whose scheduled_for time has passed (Europe/London)';

    public function handle(): int
    {
        $posts = Post::query()
            ->where('status', PostStatus::Scheduled)
            ->whereNotNull('scheduled_for')
            ->where('scheduled_for', '<=', now('Europe/London'))
            ->get();

        foreach ($posts as $post) {
            $post->update([
                'status' => PostStatus::Published,
                'published_at' => $post->scheduled_for,
                'scheduled_for' => null,
            ]);

            $this->line("Published: {$post->title}");
        }

        $this->info("Published {$posts->count()} scheduled post(s).");

        return self::SUCCESS;
    }
}
