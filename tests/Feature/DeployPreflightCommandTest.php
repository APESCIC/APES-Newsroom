<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeployPreflightCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_preflight_command_runs_and_reports_a_result(): void
    {
        $this->artisan('deploy:preflight')
            ->assertExitCode(0);
    }
}
