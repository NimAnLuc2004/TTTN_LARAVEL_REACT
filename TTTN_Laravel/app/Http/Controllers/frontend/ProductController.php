<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Carbon\Carbon;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log as Logger;

class ProductController extends Controller
{
    // Phương thức tĩnh cho subquery lặp lại
    private static function getProductIdsFromDetail()
    {
        // Lấy danh sách product_id có trong product_details
        return DB::table('product_details')
            ->select('product_id')
            ->groupBy('product_id');
    }

    private static function getSubProductStore()
    {
        // Tổng tồn kho theo product_id từ bảng product_stores thông qua product_details
        return DB::table('product_stores')
            ->join('product_details', 'product_stores.product_id', '=', 'product_details.id')
            ->where('product_stores.status', 1)
            ->select('product_details.product_id', DB::raw('SUM(product_stores.qty) as qty'))
            ->groupBy('product_details.product_id');
    }

    private static function getSubMinPrice()
    {
        // Subquery để lấy giá nhỏ nhất từ product_details
        return DB::table('product_details')
            ->select('product_id', DB::raw('MIN(price) as min_price'))
            ->groupBy('product_id');
    }

    private static function getSubDiscount($today)
    {
        // Subquery để lấy discount_percent lớn nhất từ productsale thông qua product_details
        return DB::table('productsale')
            ->join('product_details', 'productsale.product_id', '=', 'product_details.id')
            ->where('productsale.start_date', '<=', $today)
            ->where('productsale.end_date', '>', $today)
            ->select('product_details.product_id', DB::raw('MAX(productsale.discount_percent) as discount_percent'))
            ->groupBy('product_details.product_id');
    }

    private static function getSubOrderDetail()
    {
        // Tổng số lượng bán được từ order_items thông qua product_details
        return DB::table('order_items')
            ->join('product_details', 'order_items.product_id', '=', 'product_details.id')
            ->select('product_details.product_id', DB::raw('SUM(order_items.quantity) as quantity'))
            ->groupBy('product_details.product_id');
    }

    private static function getSubReviewRating()
    {
        // Subquery để lấy trung bình rating từ reviews
        return DB::table('reviews')
            ->select('product_id', DB::raw('AVG(rating) as average_rating'))
            ->groupBy('product_id');
    }

    private static function getSubDiscountWithEndDate($today)
    {
        // Subquery để lấy discount_percent lớn nhất và end_date sớm nhất từ productsale
        return DB::table('productsale')
            ->join('product_details', 'productsale.product_id', '=', 'product_details.id')
            ->where('productsale.start_date', '<=', $today)
            ->where('productsale.end_date', '>', $today)
            ->select(
                'product_details.product_id',
                DB::raw('MAX(productsale.discount_percent) as discount_percent'),
                DB::raw('MIN(productsale.end_date) as end_date')
            )
            ->groupBy('product_details.product_id');
    }

    public function product_new($limit)
    {
        $today = Carbon::now()->format('Y-m-d H:i:s');

        $products = Product::where('products.status', 1)
            ->whereIn('products.id', self::getProductIdsFromDetail()) // Sử dụng phương thức tĩnh
            ->joinSub(self::getSubProductStore(), 'product_stores', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->leftJoinSub(self::getSubDiscount($today), 'discount', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->where('product_stores.qty', '>', 0)
            ->with(['categories:id,name', 'brand:id,name', 'images'])
            ->orderBy('products.created_at', 'DESC')
            ->select(
                'products.id',
                'products.name',
                'product_stores.qty',
                'min_price.min_price',
                'discount.discount_percent'
            )
            ->limit($limit)
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ]);
    }

    public function product_sale($limit)
    {
        $limit = max(1, (int)$limit);
        $today = Carbon::now()->format('Y-m-d H:i:s');

        $products = Product::where('products.status', 1)
            ->whereIn('products.id', self::getProductIdsFromDetail()) // Sử dụng phương thức tĩnh
            ->joinSub(self::getSubProductStore(), 'product_stores', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->joinSub(self::getSubDiscount($today), 'discount', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->where('product_stores.qty', '>', 0)
            ->with(['categories:id,name', 'brand:id,name', 'images'])
            ->orderBy('discount.discount_percent', 'DESC')
            ->select(
                'products.id',
                'products.name',
                'product_stores.qty',
                'min_price.min_price',
                'discount.discount_percent'
            )
            ->limit($limit)
            ->get();

        if ($products->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm nào đang khuyến mãi',
                'products' => [],
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ]);
    }

    public function product_bestseller($limit)
    {
        $limit = max(1, (int)$limit);
        $today = Carbon::now()->format('Y-m-d H:i:s');

        $products = Product::where('products.status', 1)
            ->whereIn('products.id', self::getProductIdsFromDetail()) // Sử dụng phương thức tĩnh
            ->joinSub(self::getSubProductStore(), 'product_stores', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->joinSub(self::getSubOrderDetail(), 'orderitem', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'orderitem.product_id');
            })
            ->leftJoinSub(self::getSubDiscount($today), 'discount', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->where('product_stores.qty', '>', 0)
            ->with(['categories:id,name', 'brand:id,name', 'images'])
            ->orderByDesc('orderitem.quantity')
            ->select(

                'products.id',

                'products.name',
                'product_stores.qty as stock_qty',
                'min_price.min_price',
                'discount.discount_percent',
                'orderitem.quantity as sold_qty'
            )
            ->limit($limit)
            ->get();

        if ($products->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm bán chạy nào',
                'products' => [],
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ]);
    }

    public function product_detail($id, $limit)
    {
        $limit = max(1, (int)$limit);
        $today = Carbon::now()->format('Y-m-d H:i:s');

        $product = Product::where('products.status', 1)
            ->whereIn('products.id', self::getProductIdsFromDetail()) // Sử dụng phương thức tĩnh
            ->joinSub(self::getSubProductStore(), 'product_stores', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->leftJoinSub(self::getSubDiscount($today), 'discount', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->where('products.id', $id)
            ->where('product_stores.qty', '>', 0)
            ->with([
                'categories:id,name',
                'brand:id,name',
                'images',
                'details' => function ($query) use ($today) {
                    $query->leftJoin('product_stores', function ($join) {
                        $join->on('product_details.id', '=', 'product_stores.product_id')
                            ->where('product_stores.status', 1);
                    })
                        ->leftJoin('productsale', function ($join) use ($today) {
                            $join->on('product_details.id', '=', 'productsale.product_id')
                                ->where('productsale.start_date', '<=', $today)
                                ->where('productsale.end_date', '>', $today);
                        })
                        ->select(
                            'product_details.id',
                            'product_details.product_id',
                            'product_details.color',
                            'product_details.size',
                            'product_details.price',
                            'product_details.name',
                            'product_stores.qty as stock_qty',
                            'productsale.discount_percent'
                        );
                }
            ])
            ->select(
                'products.brand_id',
                'products.id',
                'products.created_by',
                'products.description',
                'products.name',
                'product_stores.qty',
                'min_price.min_price',
                'discount.discount_percent'
            )
            ->first();

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại hoặc không có tồn kho',
            ]);
        }

        // Lấy ID tất cả danh mục của sản phẩm
        $categoryIds = $product->categories->pluck('id')->toArray();

        // Tìm các sản phẩm liên quan thuộc các danh mục đó (ngoại trừ sản phẩm hiện tại)
        $relatedProducts = Product::where('products.status', 1)
            ->where('products.id', '!=', $product->id)
            ->whereIn('products.id', self::getProductIdsFromDetail()) // Sử dụng phương thức tĩnh
            ->whereHas('categories', function ($query) use ($categoryIds) {
                $query->whereIn('categories.id', $categoryIds);
            })
            ->joinSub(self::getSubProductStore(), 'product_stores', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->leftJoinSub(self::getSubDiscount($today), 'discount', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->where('product_stores.qty', '>', 0)
            ->with(['images'])
            ->select(
                'products.brand_id',
                'products.id',
                'products.description',
                'products.name',
                'product_stores.qty',
                'min_price.min_price',
                'discount.discount_percent'
            )
            ->limit($limit)
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu sản phẩm thành công',
            'product' => $product,
            'categories' => $product->categories,
            'product_details' => $product->details,
            'related_products' => $relatedProducts,
        ]);
    }



    public function product_deal_of_the_day($limit)
    {
        $limit = max(1, (int)$limit);
        $today = Carbon::now()->format('Y-m-d H:i:s');

        $products = Product::where('products.status', 1)
            ->whereIn('products.id', self::getProductIdsFromDetail()) // Sử dụng phương thức tĩnh
            ->joinSub(self::getSubProductStore(), 'product_stores', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->joinSub(self::getSubDiscountWithEndDate($today), 'discount', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->leftJoinSub(self::getSubOrderDetail(), 'orderitem', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'orderitem.product_id');
            })
            ->where('product_stores.qty', '>', 0)
            ->with(['categories:id,name', 'brand:id,name', 'images'])
            ->orderBy('discount.end_date', 'ASC')
            ->orderBy('discount.discount_percent', 'DESC')
            ->select(
                'products.description',
                'products.created_at',
                'products.name',
                'products.id',
                'product_stores.qty as stock_available',
                'min_price.min_price',
                'discount.discount_percent',
                'discount.end_date',
                'orderitem.quantity as stock_sold'
            )
            ->limit($limit)
            ->get();

        if ($products->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm Deal of the Day',
                'products' => [],
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ]);
    }

    public function product_top_rated($limit)
    {
        $limit = max(1, (int)$limit);
        $today = Carbon::now()->format('Y-m-d H:i:s');

        $products = Product::where('products.status', 1)
            ->whereIn('products.id', self::getProductIdsFromDetail()) // Sử dụng phương thức tĩnh
            ->joinSub(self::getSubProductStore(), 'product_stores', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->leftJoinSub(self::getSubDiscount($today), 'discount', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->leftJoinSub(self::getSubReviewRating(), 'reviews', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'reviews.product_id');
            })
            ->where('product_stores.qty', '>', 0)
            ->with(['categories:id,name', 'brand:id,name', 'images'])
            ->orderByDesc('reviews.average_rating')
            ->orderByDesc('discount.discount_percent')
            ->select(
                'products.name',
                'products.id',
                'product_stores.qty as stock_qty',
                'min_price.min_price',
                'discount.discount_percent',
                'reviews.average_rating'
            )
            ->limit($limit)
            ->get();

        if ($products->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm đánh giá cao nào',
                'products' => [],
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ]);
    }

    public function product_search(Request $request)
    {
        $query = $request->query('query', '');
        $today = Carbon::now()->format('Y-m-d H:i:s');

        $products = Product::where('products.status', 1)
            ->whereIn('products.id', self::getProductIdsFromDetail()) // Sử dụng phương thức tĩnh
            ->where('products.name', 'LIKE', '%' . $query . '%')
            ->joinSub(self::getSubProductStore(), 'product_stores', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->leftJoinSub(self::getSubDiscount($today), 'discount', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->leftJoinSub(self::getSubReviewRating(), 'reviews', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'reviews.product_id');
            })
            ->where('product_stores.qty', '>', 0)
            ->with(['categories:id,name', 'brand:id,name', 'images'])
            ->orderBy('products.created_at', 'DESC')
            ->select(

                'products.name',
                'products.id',
                'product_stores.qty',
                'min_price.min_price',
                'discount.discount_percent',
                'reviews.average_rating'
            )
            ->get();

        if ($products->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm nào',
                'products' => [],
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ]);
    }
    public function productall1(Request $request)
    {
        $today = Carbon::now()->format('Y-m-d H:i:s');

        // Lấy tham số phân trang từ request, mặc định là 12 bản ghi mỗi trang
        $perPage = $request->input('per_page', 12);
        $page = $request->input('page', 1);

        $products = Product::where('products.status', 1)
            ->whereIn('products.id', self::getProductIdsFromDetail()) // Sử dụng phương thức tĩnh
            ->joinSub(self::getSubProductStore(), 'product_stores', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'product_stores.product_id');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->leftJoinSub(self::getSubDiscount($today), 'discount', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->leftJoinSub(self::getSubReviewRating(), 'reviews', function ($join) { // Sử dụng phương thức tĩnh
                $join->on('products.id', '=', 'reviews.product_id');
            })
            ->where('product_stores.qty', '>', 0)
            ->with(['categories:id,name', 'brand:id,name', 'images'])
            ->orderBy('products.created_at', 'DESC')
            ->select(
                'products.brand_id',
                'products.created_at',
                'products.name',
                'products.id',
                'product_stores.qty',
                'min_price.min_price',
                'discount.discount_percent',
                'reviews.average_rating'
            )
            ->paginate($perPage, ['*'], 'page', $page);

        if ($products->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm nào',
                'products' => [],
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total' => 0,
                    'last_page' => 0,
                ],
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }
    public function productsByCategory(Request $request)
    {
        // Validate input
        $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100'
        ]);

        $categoryId = $request->input('category_id');
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 12);
        $today = Carbon::now()->format('Y-m-d H:i:s');

        $products = Product::where('products.status', 1)
            ->whereHas('categories', function ($query) use ($categoryId) {
                $query->where('categories.id', $categoryId)
                    ->orWhere('categories.parent_id', $categoryId);
            })
            ->join('product_details', 'products.id', '=', 'product_details.product_id')
            ->join('product_stores', 'product_details.id', '=', 'product_stores.product_id')
            ->leftJoin('product_images', function ($join) {
                $join->on('products.id', '=', 'product_images.product_id')
                    ->whereRaw('product_images.id = (SELECT MIN(id) FROM product_images WHERE product_id = products.id)');
            })
            ->joinSub(self::getSubMinPrice(), 'min_price', function ($join) {
                $join->on('products.id', '=', 'min_price.product_id');
            })
            ->leftJoinSub(self::getSubDiscount($today), 'discount', function ($join) {
                $join->on('products.id', '=', 'discount.product_id');
            })
            ->where('product_stores.status', 1)
            ->where('product_stores.qty', '>', 0)
            ->groupBy(
                'products.id',
                'products.name',
                'products.brand_id',
                'products.created_at',
                'products.description',
                'product_images.image_url',
                'min_price.min_price',
                'discount.discount_percent'
            )
            ->select(
                'products.id',
                'products.created_at',
                'products.name',
                'products.description',
                'products.brand_id',
                DB::raw('SUM(product_stores.qty) as total_qty'),
                DB::raw('IFNULL(product_images.image_url, NULL) as image_url'),
                'min_price.min_price',
                'discount.discount_percent'
            )
            ->orderBy('products.created_at', 'DESC')
            ->paginate($perPage, ['*'], 'page', $page);

        // Transform products to include full image URL and alias as image
        $products->getCollection()->transform(function ($product) {
            $product->image = $product->image_url
                ? 'http://127.0.0.1:8000/images/product/' . $product->image_url
                : 'http://127.0.0.1:8000/images/placeholder.png';
            unset($product->image_url);
            return $product;
        });

        if ($products->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm nào trong danh mục này',
                'data' => [
                    'products' => [],
                    'pagination' => [
                        'current_page' => $products->currentPage(),
                        'per_page' => $products->perPage(),
                        'total' => $products->total(),
                        'last_page' => $products->lastPage()
                    ]
                ]
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải sản phẩm thành công',
            'data' => [
                'products' => $products->items(),
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                    'last_page' => $products->lastPage()
                ]
            ]
        ], 200);
    }
    // API mới: Lọc sản phẩm theo thương hiệu
    public function getAllBrands(Request $request)
    {
        // Lấy tất cả brand với status = 1
        $brands = Brand::where('status', 1)
            ->select(
                'id',
                'name',
                'description',
                DB::raw('IFNULL(image, NULL) as image')
            )
            ->get();

        // Transform brands để thêm full URL cho image
        $brands->transform(function ($brand) {
            $brand->image = $brand->image
                ? 'http://127.0.0.1:8000/images/brand/' . $brand->image
                : 'http://127.0.0.1:8000/images/placeholder.png';
            return $brand;
        });

        // Kiểm tra nếu không có brand nào
        if ($brands->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy thương hiệu nào',
                'data' => [
                    'brands' => []
                ]
            ], 404);
        }

        // Trả về kết quả
        return response()->json([
            'status' => true,
            'message' => 'Tải danh sách thương hiệu thành công',
            'data' => [
                'brands' => $brands
            ]
        ], 200);
    }
}
