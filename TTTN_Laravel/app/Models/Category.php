<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $table = 'categories';
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id', 'id')->where('status', 1)->orderBy('created_at', 'ASC');
    }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_category');
    }
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }
}
