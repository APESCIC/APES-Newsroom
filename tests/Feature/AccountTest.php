<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_profile(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);

        $this->actingAs($user)
            ->patch(route('account.update'), ['name' => 'New Name', 'email' => $user->email])
            ->assertRedirect();

        $this->assertSame('New Name', $user->fresh()->name);
    }

    public function test_user_can_export_account_data(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('account.export'));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/json');
        $this->assertStringContainsString($user->email, $response->streamedContent());
    }

    public function test_user_can_delete_account(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->delete(route('account.destroy'))
            ->assertRedirect(route('home'));

        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
