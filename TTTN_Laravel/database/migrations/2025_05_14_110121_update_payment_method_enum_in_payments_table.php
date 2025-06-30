<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
              DB::statement("ALTER TABLE payments MODIFY payment_method ENUM('COD', 'VNPay', 'Momo', 'Paypal', 'Stripe') NOT NULL");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            DB::statement("ALTER TABLE payments MODIFY payment_method ENUM('VNPay', 'Momo', 'Paypal', 'Stripe') NOT NULL");
        });
    }
};
