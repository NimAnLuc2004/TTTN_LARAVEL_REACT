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
            $table->id(); // Khóa chính
            $table->string('name'); // Tên sản phẩm khuyến mãi
            $table->decimal('discount_percent', 5, 2)->nullable();  // % giảm giá
            $table->dateTime('start_date')->nullable(); // Ngày bắt đầu
            $table->dateTime('end_date')->nullable(); // Ngày kết thúc
            $table->timestamps(); // Tự động tạo cột created_at, updated_at
            $table->unsignedBigInteger('created_by'); // Người tạo
            $table->unsignedBigInteger('updated_by')->nullable(); // Người cập nhật
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
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
