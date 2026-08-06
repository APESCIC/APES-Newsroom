<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->json('content');
            $table->string('status')->default('draft')->index();
            $table->string('channel')->index();
            $table->string('hero_image')->nullable();
            $table->string('hero_image_alt')->nullable();
            $table->string('hero_image_caption')->nullable();
            $table->string('hero_image_credit')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->string('canonical_url')->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamp('scheduled_for')->nullable()->index();
            $table->boolean('email_on_publish')->default(false);
            $table->json('mailing_lists')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
