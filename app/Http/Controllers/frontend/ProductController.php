<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\ProductStore;
use Carbon\Carbon;
use App\Models\Orderdetail;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function product_new($limit)
    {
        $subproductstore = ProductStore::select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id');
        $products = Product::where('product.status', '=', 1)
            ->join('category', 'product.category_id', '=', 'category.id')
            ->join('brand', 'product.brand_id', '=', 'brand.id')
            ->joinSub($subproductstore, 'product_store', function ($join) {
                $join->on('product.id', '=', 'product_store.product_id');
            })
            ->leftJoin('product_sale', function ($join) {
                $today = Carbon::now()->format('Y-m-d H:i:s');
                $join->on('product.id', '=', 'product_sale.product_id')
                    ->where([
                        ['product_sale.date_begin', '<=', $today],
                        ['product_sale.date_end', '>=', $today],
                        ['product_sale.status', '=', 1]
                    ]);
            })
            ->with('images')
            ->orderBy('product.created_at', 'DESC')
            ->select("product.id", "product.name","product_store.qty","product.content","category.id as catid","brand.id as brandid", "product.price","category.name as catname", "product.slug", "product_sale.price_sale")
            ->limit($limit)
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ];
        return response()->json($result);
    }
    public function product_sale($limit)
    {
        $subproductstore = ProductStore::select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id');
        $products = Product::where('product.status', '=', 1)
        ->join('category', 'product.category_id', '=', 'category.id')
        ->join('brand', 'product.brand_id', '=', 'brand.id')
            ->joinSub($subproductstore, 'product_store', function ($join) {
                $join->on('product.id', '=', 'product_store.product_id');
            })
            ->join('product_sale', function ($join) {
                $today = Carbon::now()->format('Y-m-d H:i:s');
                $join->on('product.id', '=', 'product_sale.product_id')
                    ->where([
                        ['product_sale.date_begin', '<=', $today],
                        ['product_sale.date_end', '>', $today],
                        ['product_sale.status', '=', 1]
                    ]);
            })
            ->with('images')
            ->orderBy('product_sale.price_sale', 'DESC')
            ->select("product.id","product.content" ,"product.name","category.id as catid","product_store.qty","brand.id as brandid", "product.price","category.name as catname", "product.slug", "product_sale.price_sale")
            ->limit($limit)
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ];
        return response()->json($result);
    }
    public function product_bestseller($limit)
    {
        $subproductstore = ProductStore::select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id');
        $suborderdetail = Orderdetail::select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id');
        $products = Product::where('product.status', '=', 1)
        ->join('brand', 'product.brand_id', '=', 'brand.id')
        ->join('category', 'product.category_id', '=', 'category.id')
            ->joinSub($subproductstore, 'product_store', function ($join) {
                $join->on('product.id', '=', 'product_store.product_id');
            })->joinSub($suborderdetail, 'orderdetail', function ($join) {
                $join->on('product.id', '=', 'orderdetail.product_id');
            })
            ->leftJoin('product_sale', function ($join) {
                $today = Carbon::now()->format('Y-m-d H:i:s');
                $join->on('product.id', '=', 'product_sale.product_id')
                    ->where([
                        ['product_sale.date_begin', '<=', $today],
                        ['product_sale.date_end', '>', $today],
                        ['product_sale.status', '=', 1]
                    ]);
            })
            ->with('images')
            ->orderBy('orderdetail.qty', 'DESC')
            ->select("product.id", "product.name","product.content","category.id as catid","brand.id as brandid","product_store.qty" ,"product.price", "category.name as catname","product.slug", "product_sale.price_sale", "orderdetail.qty")
            ->limit($limit)
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ];
        return response()->json($result);
    }
    public function product_detail($slug, $limit)
    {
        $product = Product::where('product.status', '=', 1)
            ->where('product.slug', '=', $slug)
            ->join('category', 'product.category_id', '=', 'category.id')
            ->join('brand', 'product.brand_id', '=', 'brand.id')
            ->with('images')
            ->select(
                "product.id",
                "product.id",
                "category.id as catid",
                "brand.id as brandid",
                "product.description",
                "product.price",
                "category.name as category_name",
                "brand.name as brand_name",
                "product.created_at"
            )
            ->first();

        if ($product) {
            $relatedProducts = Product::where('status', '=', 1)
            ->where(function($query) use ($product) {
                $query->where('category_id', '=', $product->catid); 
            })
                ->where('id', '!=', $product->id)
                ->orderBy('created_at', 'DESC')
                ->with('images')
                ->select("id", "name", "price", "slug")
                ->limit($limit)
                ->get();

            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu sản phẩm thành công',
                'product' => $product,
                'related_products' => $relatedProducts
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Sản phẩm không tồn tại'
            ];
        }

        return response()->json($result);
    }
    public function productall()
    {
        $subproductstore = ProductStore::select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id');
        $products = Product::where('product.status', '=', 1)
            ->join('category', 'product.category_id', '=', 'category.id')
            ->join('brand', 'product.brand_id', '=', 'brand.id')
            ->joinSub($subproductstore, 'product_store', function ($join) {
                $join->on('product.id', '=', 'product_store.product_id');
            })
            ->leftJoin('product_sale', function ($join) {
                $today = Carbon::now()->format('Y-m-d H:i:s');
                $join->on('product.id', '=', 'product_sale.product_id')
                    ->where([
                        ['product_sale.date_begin', '<=', $today],
                        ['product_sale.date_end', '>=', $today],
                        ['product_sale.status', '=', 1]
                    ]);
            })
            ->with('images')
            ->orderBy('product.created_at', 'DESC')
            ->select("product.id", "product.name","product_store.qty","product.content","category.id as catid","brand.id as brandid", "product.price","category.name as catname", "product.slug", "product_sale.price_sale")

            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ];
        return response()->json($result);
    }
}
