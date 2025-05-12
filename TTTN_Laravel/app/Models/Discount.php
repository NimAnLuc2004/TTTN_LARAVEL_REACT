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
    public function getStatusAttribute($value)
    {
        $validUntil = $this->valid_until instanceof \Carbon\Carbon
            ? $this->valid_until
            : Carbon::parse($this->valid_until);

        if ($value === 1 && $validUntil->isPast()) {
            return 'Hết hạn';
        }

        return $value === 1 ? 'Có hạn sử dụng' : 'Đã sử dụng';
    }
    protected $casts = [
        'valid_until' => 'date', // Cast to Carbon instance
    ];

}
