<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique(); // ISO code: IDR, USD, etc.
            $table->string('name'); // e.g., Indonesian Rupiah
            $table->string('symbol')->nullable(); // e.g., Rp, $, €
            $table->string('country')->nullable(); // e.g., Indonesia
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('currencies');
    }
};
