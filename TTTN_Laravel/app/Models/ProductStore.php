<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductStore extends Model
{
    use HasFactory;
    protected $table ='product_stores';
    public function productDetail()
{
    return $this->belongsTo(ProductDetail::class, 'product_id');
}
}
