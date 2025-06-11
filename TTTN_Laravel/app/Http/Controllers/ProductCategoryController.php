<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function index()
    {
        $procat = ProductCategory::query()
            ->select("product_id", "category_id")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'productcategory' => $procat
        ];
        return response()->json($result);
    }
    
}
