<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('import_runs', function (Blueprint $table) {
            $table->id();
            $table->string('type')->index();
            $table->string('status')->default('pending')->index();
            $table->boolean('dry_run')->default(true);
            $table->string('source_path')->nullable();
            $table->string('source_checksum')->nullable()->index();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->json('report')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->string('ghost_id')->nullable()->unique()->after('id');
            $table->boolean('needs_import_review')->default(false)->after('review_notes');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->string('ghost_id')->nullable()->unique()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('tags', function (Blueprint $table) {
            $table->dropColumn('ghost_id');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['ghost_id', 'needs_import_review']);
        });

        Schema::dropIfExists('import_runs');
    }
};
