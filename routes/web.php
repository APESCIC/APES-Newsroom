<?php

use App\Enums\Role;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RssController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\Staff\PostController as StaffPostController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/health', HealthController::class)->name('health');
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/rss.xml', [RssController::class, 'index'])->name('rss');

Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');
Route::get('/{channel}', [ChannelController::class, 'show'])
    ->where('channel', 'apes-cic|apes-shelter-rescue|apes-pet-care-clinic')
    ->name('channels.show');

Route::middleware(['auth', 'verified'])->prefix('account')->name('account.')->group(function () {
    Route::get('/', [AccountController::class, 'show'])->name('show');
    Route::patch('/', [AccountController::class, 'update'])->name('update');
    Route::get('/export', [AccountController::class, 'export'])->name('export');
    Route::delete('/', [AccountController::class, 'destroy'])->name('destroy');
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
    });

require __DIR__.'/auth.php';
