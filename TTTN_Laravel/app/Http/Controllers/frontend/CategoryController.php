<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;

use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function category_list()
    {
        // Fetch active parent categories with their active children and grandchildren
        $category_list = Category::where([
            ['status', '=', 1],
            ['parent_id', '=', null]
        ])
            ->with([
                'children' => function ($query) {
                    $query->where('status', 1)
                        ->select('id', 'name', 'image', 'parent_id')
                        ->with([
                            'children' => function ($subQuery) {
                                $subQuery->where('status', 1)
                                    ->select('id', 'name', 'image', 'parent_id');
                            }
                        ]);
                }
            ])
            ->orderBy('created_at', 'DESC')
            ->select('id', 'name', 'image')
            ->get();

        // Calculate total stock quantity per product from product_stores via product_details
        $subProductStore = DB::table('product_stores')
            ->join('product_details', 'product_stores.product_id', '=', 'product_details.id')
            ->where('product_stores.status', 1)
            ->select('product_details.product_id', DB::raw('SUM(product_stores.qty) as qty'))
            ->groupBy('product_details.product_id');

        // Count active products per category (including child and grandchild categories)
        $categoryCounts = DB::table('product_category')
            ->join('categories', 'product_category.category_id', '=', 'categories.id')
            ->join('products', 'product_category.product_id', '=', 'products.id')
            ->joinSub($subProductStore, 'product_stores', function ($join) {
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->where('products.status', 1)
            ->where('product_stores.qty', '>', 0)
            ->groupBy('categories.id')
            ->select(
                'categories.id as category_id',
                DB::raw('COUNT(DISTINCT products.id) as product_count')
            )
            ->get();

        // Map product counts to categories, their children, and grandchildren
        $category_list = $category_list->map(function ($category) use ($categoryCounts) {
            // Attach product count to parent category
            $countInfo = $categoryCounts->firstWhere('category_id', $category->id);
            $category->product_count = $countInfo ? $countInfo->product_count : 0;

            // Attach product count to child categories
            if ($category->children) {
                $category->children = $category->children->map(function ($child) use ($categoryCounts) {
                    $childCountInfo = $categoryCounts->firstWhere('category_id', $child->id);
                    $child->product_count = $childCountInfo ? $childCountInfo->product_count : 0;

                    // Attach product count to grandchild categories
                    if ($child->children) {
                        $child->children = $child->children->map(function ($grandchild) use ($categoryCounts) {
                            $grandchildCountInfo = $categoryCounts->firstWhere('category_id', $grandchild->id);
                            $grandchild->product_count = $grandchildCountInfo ? $grandchildCountInfo->product_count : 0;
                            return $grandchild;
                        });
                    }

                    return $child;
                });
            }

            return $category;
        });

        // Handle empty category list
        if ($category_list->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục nào',
                'category_list' => []
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải danh sách danh mục thành công',
            'category_list' => $category_list
        ], 200);
    }
}
