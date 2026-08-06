<?php

namespace App\Console\Commands;

use App\Services\Import\GhostContentImporter;
use Illuminate\Console\Command;

class ImportGhostContentCommand extends Command
{
    protected $signature = 'ghost:import-content
        {json : Path to Ghost content JSON export}
        {--media= : Optional path to extracted media archive directory}
        {--dry-run : Count and report without writing}
        {--force : Persist changes (required when not using --dry-run)}';

    protected $description = 'Import Ghost posts, tags, authors, media, and redirects from Admin export files (#9)';

    public function handle(GhostContentImporter $importer): int
    {
        $dryRun = (bool) $this->option('dry-run') || ! $this->option('force');

        if (! $this->option('dry-run') && ! $this->option('force')) {
            $this->warn('Refusing to write without --force. Running as dry-run. Pass --force to persist.');
            $dryRun = true;
        }

        $report = $importer->import(
            (string) $this->argument('json'),
            $this->option('media') ? (string) $this->option('media') : null,
            $dryRun,
        );

        $this->info($dryRun ? 'Dry-run complete.' : 'Import complete.');
        $this->line(json_encode($report, JSON_PRETTY_PRINT));

        return self::SUCCESS;
    }
}
