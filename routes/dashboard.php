<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('dashboard')
    ->as('dashboard.')
    ->group(function () {
       Route::get('/', [DashboardController::class, 'index'])->name('index');
    });

    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
});
