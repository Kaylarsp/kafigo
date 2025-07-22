<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Bank BCA, Cash, Dompet, etc.
            $table->enum('type', ['bank', 'cash', 'credit_card', 'investment', 'loan', 'other']);
            $table->decimal('balance', 15, 2)->default(0);
            $table->decimal('initial_balance', 15, 2)->default(0);
            $table->string('currency', 3)->default('IDR');
            $table->string('color', 7)->default('#6366f1'); // Hex color
            $table->string('icon')->nullable(); // Icon name
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('include_in_balance')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
