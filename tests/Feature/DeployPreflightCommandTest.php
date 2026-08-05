<?php

namespace Tests\Feature;

use Tests\TestCase;

class DeployPreflightCommandTest extends TestCase
{
    public function test_preflight_command_runs_and_reports_a_result(): void
    {
        $this->artisan('deploy:preflight')
            ->assertExitCode(0);
    }
}
