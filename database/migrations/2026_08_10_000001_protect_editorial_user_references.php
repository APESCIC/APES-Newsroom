<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->replaceUserForeignKey('posts', 'author_id', 'restrict');
        $this->replaceUserForeignKey('post_revisions', 'editor_id', 'restrict');
        $this->replaceUserForeignKey('campaigns', 'created_by', 'restrict');
        $this->replaceUserForeignKey('audit_logs', 'actor_id', 'restrict');
        $this->replaceUserForeignKey('moderation_audits', 'actor_id', 'restrict');
        $this->replaceUserForeignKey('import_runs', 'actor_id', 'restrict');
    }

    public function down(): void
    {
        $this->replaceUserForeignKey('posts', 'author_id', 'cascade');
        $this->replaceUserForeignKey('post_revisions', 'editor_id', 'cascade');
        $this->replaceUserForeignKey('campaigns', 'created_by', 'cascade');
        $this->replaceUserForeignKey('audit_logs', 'actor_id', 'set null');
        $this->replaceUserForeignKey('moderation_audits', 'actor_id', 'set null');
        $this->replaceUserForeignKey('import_runs', 'actor_id', 'set null');
    }

    private function replaceUserForeignKey(string $tableName, string $column, string $onDelete): void
    {
        Schema::table($tableName, function (Blueprint $table) use ($column, $onDelete) {
            $table->dropForeign([$column]);
            $table->foreign($column)->references('id')->on('users')->onDelete($onDelete);
        });
    }
};
