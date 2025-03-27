<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImage;
use App\Models\OrderItem;

class Product extends Model
{
    use HasFactory;
    protected $table ='products';
    public function images(){
        return $this->hasMany(ProductImage::class);
    }
    public function orderDetails()
    {
        return $this->hasMany(OrderItem::class);
    }
}
