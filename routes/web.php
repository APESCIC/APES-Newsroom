<?php

use App\Enums\Role;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\ModerationController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Mailing\ConfirmController;
use App\Http\Controllers\Mailing\PreferenceController;
use App\Http\Controllers\Mailing\SignupController;
use App\Http\Controllers\Mailing\UnsubscribeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\RssController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\Staff\CampaignController as StaffCampaignController;
use App\Http\Controllers\Staff\PostController as StaffPostController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/health', HealthController::class)->name('health');
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/rss.xml', [RssController::class, 'index'])->name('rss');

Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');
Route::get('/profiles/{profile}', [ProfileController::class, 'show'])->name('profiles.show');

Route::get('/mailing/signup', [SignupController::class, 'show'])->name('mailing.signup');
Route::post('/mailing/signup', [SignupController::class, 'store'])->name('mailing.signup.store');
Route::get('/mailing/confirm/{token}', ConfirmController::class)->name('mailing.confirm');
Route::get('/mailing/preferences', [PreferenceController::class, 'showSigned'])->name('mailing.preferences.signed');
Route::post('/mailing/preferences', [PreferenceController::class, 'updateSigned'])->name('mailing.preferences.signed.update');
Route::get('/mailing/unsubscribe', [UnsubscribeController::class, 'show'])->name('mailing.unsubscribe');
Route::post('/mailing/unsubscribe', [UnsubscribeController::class, 'store'])->name('mailing.unsubscribe.store');
Route::post('/mailing/unsubscribe/one-click', [UnsubscribeController::class, 'oneClick'])->name('mailing.unsubscribe.one-click');

Route::get('/{channel}', [ChannelController::class, 'show'])
    ->where('channel', 'apes-cic|apes-shelter-rescue|apes-pet-care-clinic')
    ->name('channels.show');

Route::middleware(['auth', 'verified'])->prefix('account')->name('account.')->group(function () {
    Route::get('/', [AccountController::class, 'show'])->name('show');
    Route::patch('/', [AccountController::class, 'update'])->name('update');
    Route::get('/export', [AccountController::class, 'export'])->name('export');
    Route::delete('/', [AccountController::class, 'destroy'])->name('destroy');
    Route::get('/mailing', [PreferenceController::class, 'showAccount'])->name('mailing');
    Route::post('/mailing', [PreferenceController::class, 'updateAccount'])->name('mailing.update');
    Route::get('/public-profile', [ProfileController::class, 'edit'])->name('public-profile');
    Route::post('/public-profile', [ProfileController::class, 'update'])->name('public-profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/articles/{slug}/comments', [CommentController::class, 'store'])->name('articles.comments.store');
    Route::patch('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::post('/articles/{slug}/reactions', [ReactionController::class, 'toggle'])->name('articles.reactions.toggle');
});

Route::middleware(['auth', 'verified', 'role:'.Role::Admin->value])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/moderation', [ModerationController::class, 'index'])->name('moderation.index');
        Route::post('/moderation/profiles/{profile}', [ModerationController::class, 'moderateProfile'])->name('moderation.profiles');
        Route::post('/moderation/comments/{comment}', [ModerationController::class, 'moderateComment'])->name('moderation.comments');
    });

Route::middleware(['auth', 'verified', 'role:'.Role::Staff->value])
    ->prefix('staff')
    ->name('staff.')
    ->group(function () {
        Route::get('/posts', [StaffPostController::class, 'index'])->name('posts.index');
        Route::get('/posts/new', [StaffPostController::class, 'create'])->name('posts.create');
        Route::post('/posts', [StaffPostController::class, 'store'])->name('posts.store');
        Route::get('/posts/{post}/edit', [StaffPostController::class, 'edit'])->name('posts.edit');
        Route::patch('/posts/{post}', [StaffPostController::class, 'update'])->name('posts.update');
        Route::post('/posts/{post}/submit', [StaffPostController::class, 'submitForReview'])->name('posts.submit');
        Route::post('/posts/{post}/schedule', [StaffPostController::class, 'schedule'])->name('posts.schedule');
        Route::post('/posts/{post}/publish', [StaffPostController::class, 'publish'])->name('posts.publish');
        Route::get('/posts/{post}/preview', [StaffPostController::class, 'preview'])->name('posts.preview');
        Route::get('/posts/{post}/campaign', [StaffCampaignController::class, 'preview'])->name('posts.campaign.preview');
        Route::post('/posts/{post}/campaign/test-send', [StaffCampaignController::class, 'testSend'])->name('posts.campaign.test');
    });

require __DIR__.'/auth.php';
