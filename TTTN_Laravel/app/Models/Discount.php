<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;
    protected $table ='discounts';
    protected $fillable = [
        'code',
        'discount_percent',
        'valid_until',
        'status',
        'created_by',
        'updated_by',
    ];
  public function getStatusLabelAttribute()
    {
        if ($this->status === 1 && $this->valid_until?->isPast()) {
            return 'Hết hạn';
        }

        return match ($this->status) {
            0 => 'Chưa phát hành',
            1 => 'Chưa sử dụng',
            2 => 'Đã sử dụng',
            default => 'Không xác định',
        };
    }
    protected $casts = [
        'valid_until' => 'date', // Cast to Carbon instance
    ];

}
