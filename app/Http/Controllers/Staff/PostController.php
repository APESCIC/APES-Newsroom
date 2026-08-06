<?php

namespace App\Http\Controllers\Staff;

use App\Enums\Channel;
use App\Enums\MailingList;
use App\Enums\PostStatus;
use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\StorePostRequest;
use App\Http\Requests\Staff\UpdatePostRequest;
use App\Models\Post;
use App\Models\PostRevision;
use App\Services\EditorJs\BlockRenderer;
use App\Services\EditorJs\BlockValidator;
use App\Services\Mailing\CampaignService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(
        private readonly BlockValidator $validator,
        private readonly BlockRenderer $renderer,
        private readonly CampaignService $campaigns,
    ) {}

    public function index(Request $request): Response
    {
        $query = Post::query()->with('author');

        if ($request->user()->role === Role::Staff) {
            $query->where('author_id', $request->user()->id);
        }

        $posts = $query->latest('updated_at')->get()->map(fn (Post $post) => [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'status' => $post->status->value,
            'channel' => $post->channel->value,
            'updated_at' => $post->updated_at?->toIso8601String(),
            'author' => $post->author->name,
        ]);

        return Inertia::render('Staff/Posts/Index', ['posts' => $posts]);
    }

    public function create(): Response
    {
        return Inertia::render('Staff/Posts/Edit', [
            'post' => null,
            'channels' => $this->channelOptions(),
            'mailingLists' => $this->mailingListOptions(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $content = $this->validator->validate($validated['content']);

        $post = Post::create([
            ...$validated,
            'content' => $content,
            'slug' => $validated['slug'] ?? Str::slug($validated['title']),
            'author_id' => $request->user()->id,
            'status' => PostStatus::Draft,
        ]);

        $this->saveRevision($post, $request->user()->id);

        return redirect()->route('staff.posts.edit', $post);
    }

    public function edit(Post $post): Response
    {
        $this->authorizeEdit($post);

        return Inertia::render('Staff/Posts/Edit', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'status' => $post->status->value,
                'channel' => $post->channel->value,
                'meta_title' => $post->meta_title,
                'meta_description' => $post->meta_description,
                'scheduled_for' => $post->scheduled_for?->format('Y-m-d\TH:i'),
                'email_on_publish' => $post->email_on_publish,
                'mailing_lists' => $post->mailing_lists ?? [],
            ],
            'channels' => $this->channelOptions(),
            'mailingLists' => $this->mailingListOptions(),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $this->authorizeEdit($post);

        $validated = $request->validated();
        $content = $this->validator->validate($validated['content']);

        $post->update([
            ...$validated,
            'content' => $content,
        ]);

        $this->saveRevision($post, $request->user()->id);

        return back();
    }

    public function submitForReview(Request $request, Post $post): RedirectResponse
    {
        $this->authorizeEdit($post);

        $post->update(['status' => PostStatus::InReview]);

        return back();
    }

    public function schedule(Request $request, Post $post): RedirectResponse
    {
        $this->authorizeAdmin();

        $request->validate(['scheduled_for' => ['required', 'date', 'after:now']]);

        $post->update([
            'status' => PostStatus::Scheduled,
            'scheduled_for' => $request->input('scheduled_for'),
        ]);

        return back();
    }

    public function publish(Request $request, Post $post): RedirectResponse
    {
        $this->authorizeAdmin();

        if ($post->status === PostStatus::Published) {
            return back();
        }

        DB::transaction(function () use ($request, $post) {
            $post->update([
                'status' => PostStatus::Published,
                'published_at' => now(),
                'scheduled_for' => null,
            ]);

            $this->campaigns->createFromPublishedPost($post->fresh(), $request->user());
        });

        return back();
    }

    public function preview(Request $request, Post $post): Response
    {
        $this->authorizeEdit($post);

        return Inertia::render('Articles/Show', [
            'article' => $this->articlePayload($post),
            'preview' => true,
            'comments' => [],
            'reactions' => [
                'helpful' => 0,
                'support' => 0,
                'thank_you' => 0,
                'mine' => [],
            ],
            'canEngage' => false,
        ]);
    }

    private function authorizeEdit(Post $post): void
    {
        if (! $post->isEditableBy(request()->user())) {
            abort(403);
        }
    }

    private function authorizeAdmin(): void
    {
        if (! request()->user()->role->atLeast(Role::Admin)) {
            abort(403);
        }
    }

    private function saveRevision(Post $post, int $editorId): void
    {
        PostRevision::create([
            'post_id' => $post->id,
            'editor_id' => $editorId,
            'content' => $post->content,
            'title' => $post->title,
        ]);
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function channelOptions(): array
    {
        return collect(Channel::cases())->map(fn (Channel $c) => [
            'value' => $c->value,
            'label' => $c->label(),
        ])->all();
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function mailingListOptions(): array
    {
        return collect(MailingList::cases())->map(fn (MailingList $list) => [
            'value' => $list->value,
            'label' => $list->label(),
        ])->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function articlePayload(Post $post): array
    {
        return [
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'html' => $this->renderer->toHtml($post->content),
            'channel' => $post->channel->label(),
            'author' => $post->author->name,
            'published_at' => $post->published_at?->toIso8601String(),
            'meta_title' => $post->meta_title ?? $post->title,
            'meta_description' => $post->meta_description ?? $post->excerpt,
        ];
    }
}
