<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type', ['income', 'expense', 'transfer']);
            $table->decimal('amount', 15, 2);
            $table->string('currency', 3)->default('IDR');
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->date('date');
            $table->datetime('datetime');

            // For transfers
            $table->foreignId('transfer_account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->foreignId('transfer_transaction_id')->nullable()->constrained('transactions')->onDelete('cascade');

            // Recurring transaction
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurring_type', ['daily', 'weekly', 'monthly', 'yearly'])->nullable();
            $table->integer('recurring_interval')->nullable(); // Every X days/weeks/months/years
            $table->date('recurring_end_date')->nullable();
            $table->foreignId('recurring_parent_id')->nullable()->constrained('transactions')->onDelete('cascade');

            // Additional fields
            $table->string('reference')->nullable(); // Invoice number, receipt number, etc.
            $table->string('location')->nullable();
            $table->json('attachments')->nullable(); // Store file paths

            $table->timestamps();

            $table->index(['user_id', 'date']);
            $table->index(['user_id', 'type', 'date']);
            $table->index(['account_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
