<?php

use App\Http\Controllers\AccountController;
use Illuminate\Support\Facades\Route;

Route::prefix('accounts')
    ->as('accounts.')
    ->group(function () {
        Route::get('/', [AccountController::class, 'index'])->name('index');
        Route::get('/create', [AccountController::class, 'create'])->name('create');
        Route::post('/', [AccountController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [AccountController::class, 'edit'])->name('edit');
        Route::put('/{id}', [AccountController::class, 'update'])->name('update');
        Route::delete('/{id}', [AccountController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [AccountController::class, 'reorder'])->name('reorder');
    });
