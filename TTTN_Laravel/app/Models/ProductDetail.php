<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDetail extends Model
{
    use HasFactory;
    
    protected $table ='product_details';
    public function orderDetails()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function productStore()
{
    return $this->hasOne(ProductStore::class, 'product_id', 'id'); // Or belongsTo, depending on your schema
}
}
