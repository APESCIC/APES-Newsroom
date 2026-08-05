<?php

use App\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

// Deliberately public and unauthenticated: Cloudron and external uptime
// monitors call this. See App\Http\Controllers\HealthController for what
// it does and does not expose.
Route::get('/health', HealthController::class)->name('health');
