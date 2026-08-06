<?php

namespace App\Jobs;

use App\Models\ImportRun;
use App\Services\Import\GhostMembersCsvImporter;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessGhostMembersImportJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $importRunId,
        public bool $dryRun,
    ) {}

    public function handle(GhostMembersCsvImporter $importer): void
    {
        $run = ImportRun::query()->findOrFail($this->importRunId);
        $importer->import(
            (string) $run->source_path,
            $this->dryRun,
            $run->actor,
            $run,
        );
    }
}
