<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CurrencyController;
use Illuminate\Support\Facades\Route;

Route::prefix('accounts')
    ->as('accounts.')
    ->group(function () {
        Route::get('/select', [CurrencyController::class, 'select'])->name('select');

    });
