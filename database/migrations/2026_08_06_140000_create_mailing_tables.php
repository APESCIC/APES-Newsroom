<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mailing_contacts', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('mailing_list_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mailing_contact_id')->constrained()->cascadeOnDelete();
            $table->string('list');
            $table->string('status')->default('pending')->index();
            $table->string('confirm_token', 64)->nullable()->unique();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();

            $table->unique(['mailing_contact_id', 'list']);
        });

        Schema::create('consent_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mailing_contact_id')->nullable()->constrained()->nullOnDelete();
            $table->string('email')->index();
            $table->string('list')->nullable();
            $table->string('action');
            $table->string('source');
            $table->string('wording_version')->default('v1');
            $table->json('evidence')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('suppressions', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('reason');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->json('lists');
            $table->json('snapshot');
            $table->string('status')->default('queued')->index();
            $table->boolean('is_test')->default(false);
            $table->string('test_recipient')->nullable();
            $table->timestamp('queued_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['post_id', 'is_test']);
        });

        Schema::create('campaign_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('email');
            $table->string('status')->default('queued')->index();
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->string('idempotency_key')->unique();
            $table->text('last_error')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamps();

            $table->unique(['campaign_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_recipients');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('suppressions');
        Schema::dropIfExists('consent_events');
        Schema::dropIfExists('mailing_list_subscriptions');
        Schema::dropIfExists('mailing_contacts');
    }
};
