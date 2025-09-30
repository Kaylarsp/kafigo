<?php

use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::prefix('transactions')
    ->as('transactions.')
    ->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('index');
        Route::get('/create', [TransactionController::class, 'create'])->name('create');
        Route::get('/{id}', [TransactionController::class, 'show'])->name('show');
        Route::post('/', [TransactionController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [TransactionController::class, 'edit'])->name('edit');
        Route::put('/{id}', [TransactionController::class, 'update'])->name('update');
        Route::delete('/{id}', [TransactionController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [TransactionController::class, 'reorder'])->name('reorder');
        Route::post('/get-transaction', [TransactionController::class, 'getTransaction'])->name('get-transaction');

    });
