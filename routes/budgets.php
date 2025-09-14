<?php

use App\Http\Controllers\BudgetController;
use Illuminate\Support\Facades\Route;

Route::prefix('budgets')
    ->as('budgets.')
    ->group(function () {
        Route::get('/', [BudgetController::class, 'index'])->name('index');
        Route::post('/', [BudgetController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [BudgetController::class, 'edit'])->name('edit');
        Route::put('/{id}', [BudgetController::class, 'update'])->name('update');
        Route::delete('/{id}', [BudgetController::class, 'destroy'])->name('destroy');

        // opsional, buat ringkasan budget
        Route::get('/{id}/summary', [BudgetController::class, 'summary'])->name('summary');
    });
