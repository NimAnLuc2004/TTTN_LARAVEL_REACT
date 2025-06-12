<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
  
    protected $fillable = [
        'user_id', 
        'product_id', 
        'created_by',
        'created_at', 
        'updated_at'
    ];
    protected $table = 'wishlists';
    
}
