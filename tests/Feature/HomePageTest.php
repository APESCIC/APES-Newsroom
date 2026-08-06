<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_homepage_renders_via_inertia(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('channels', 3)
            ->has('channels.0', fn (Assert $c) => $c
                ->has('slug')
                ->has('label')
                ->etc())
            ->has('recent')
            ->has('featured'));
    }
}
