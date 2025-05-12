<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    
    protected $table ='carts';
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'created_by',
        'updated_by',
    ];
    public function product()
    {
        return $this->belongsTo(ProductDetail::class, 'product_id');
    }
}
