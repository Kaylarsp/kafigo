<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['income', 'outcome', 'transfer']);
            $table->foreignId('category_id')->constrained()->onDelete('cascade')->nullable();
            $table->foreignId('to_account_id')->constrained('accounts')->onDelete('cascade')->nullable();
            $table->foreignId('tags')->constrained()->onDelete('cascade')->nullable();
            $table->decimal('amount', 20, 2);
            $table->dateTime('transaction_date');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
