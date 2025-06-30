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
        Schema::create('productsale', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->decimal('discount_percent', 5, 2)->nullable();  
            $table->dateTime('start_date')->nullable(); 
            $table->dateTime('end_date')->nullable();
            $table->timestamps(); 
            $table->unsignedBigInteger('created_by'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productsale');
    }
};
