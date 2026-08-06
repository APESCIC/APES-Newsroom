<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Services\Engagement\ProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(private readonly ProfileService $profiles) {}

    public function edit(Request $request): Response
    {
        $profile = $this->profiles->forUser($request->user());

        return Inertia::render('Account/PublicProfile', [
            'profile' => [
                'display_name' => $profile->display_name,
                'bio' => $profile->bio,
                'avatar_url' => $profile->avatar_path ? url('/storage/'.$profile->avatar_path) : null,
                'public_opt_in' => $profile->public_opt_in,
                'moderation_status' => $profile->moderation_status->value,
                'moderation_notes' => $profile->moderation_status->value === 'rejected'
                    ? $profile->moderation_notes
                    : null,
            ],
            'status' => session('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'display_name' => ['nullable', 'string', 'max:80'],
            'bio' => ['nullable', 'string', 'max:500'],
            'public_opt_in' => ['sometimes', 'boolean'],
            'avatar' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $this->profiles->update(
            $request->user(),
            [
                'display_name' => $validated['display_name'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'public_opt_in' => $request->boolean('public_opt_in'),
            ],
            $request->file('avatar'),
        );

        return back()->with('status', 'profile-submitted');
    }

    public function show(string $id): Response
    {
        $profile = Profile::query()->with('user')->findOrFail($id);
        $payload = $profile->publicPayload();

        abort_unless($payload !== null, 404);

        return Inertia::render('Profiles/Show', [
            'profile' => $payload,
        ]);
    }
}
