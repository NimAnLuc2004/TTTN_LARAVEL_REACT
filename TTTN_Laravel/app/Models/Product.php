<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImage;
use App\Models\OrderItem;
use App\Models\Brand;


class Product extends Model
{
    use HasFactory;
    protected $table = 'products';
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_category', 'product_id', 'category_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
    public function details()
    {
        return $this->hasMany(ProductDetail::class, 'product_id', 'id');
    }
}
