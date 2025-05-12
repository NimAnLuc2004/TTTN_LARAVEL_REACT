<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WishListController extends Controller
{
    // Lấy danh sách wishlist theo user_id (có phân trang)
    public function index()
    {
        $today = Carbon::now()->format('Y-m-d H:i:s');

        // Subquery to get the minimum price from product_details
        $subMinPrice = DB::table('product_details')
            ->select('product_id', DB::raw('MIN(price) as min_price'))
            ->groupBy('product_id');

        // Subquery to get the maximum discount_percent from productsale
        $subDiscount = DB::table('productsale')
            ->join('product_details', 'productsale.product_id', '=', 'product_details.id')
            ->where('productsale.start_date', '<=', $today)
            ->where('productsale.end_date', '>', $today)
            ->select('product_details.product_id', DB::raw('MAX(productsale.discount_percent) as discount_percent'))
            ->groupBy('product_details.product_id');

        // Subquery to get the average rating from reviews
        $subReviewRating = DB::table('reviews')
            ->select('product_id', DB::raw('AVG(rating) as average_rating'))
            ->groupBy('product_id');

        // Fetch wishlist with product details, min_price, discount, and rating
        $wishlist = Wishlist::with([
            'product' => function ($query) use ($subMinPrice, $subDiscount, $subReviewRating) {
                $query->where('status', 1)
                    ->joinSub($subMinPrice, 'min_price', function ($join) {
                        $join->on('products.id', '=', 'min_price.product_id');
                    })
                    ->leftJoinSub($subDiscount, 'discount', function ($join) {
                        $join->on('products.id', '=', 'discount.product_id');
                    })
                    ->leftJoinSub($subReviewRating, 'reviews', function ($join) {
                        $join->on('products.id', '=', 'reviews.product_id');
                    })
                    ->select(
                        'products.*',
                        'min_price.min_price',
                        'discount.discount_percent',
                        'reviews.average_rating'
                    )
                    ->with(['images', 'categories:id,name', 'brand:id,name']);
            }
        ])
            ->where('user_id', Auth::id())
            ->paginate(10);

        // Check if wishlist is empty
        if ($wishlist->isEmpty()) {
            return response()->json([
                'status' => true,
                'message' => 'Danh sách yêu thích trống',
                'wishlist' => $wishlist
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải danh sách yêu thích thành công',
            'wishlist' => $wishlist
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:product_details,id',
        ]);

        // Check if already in wishlist
        $existing = Wishlist::where('user_id', $validated['user_id'])
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm đã có trong danh sách yêu thích.',
            ], 400);
        }

        $wishlist = Wishlist::create([
            'user_id' => Auth::id(),
            'product_id' => $validated['product_id'],
            'created_by' => Auth::id(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        return response()->json([
            'status' => true,
            'message' => 'Đã thêm vào danh sách yêu thích.',
            'wishlist' => $wishlist,
        ], 201);
    }

    public function check(Request $request, $productId)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json([
                'status' => false,
                'message' => 'Vui lòng đăng nhập.',
                'isWishlisted' => false,
            ], 401);
        }

        // Validate product_id
        $validated = $request->merge(['product_id' => $productId])->validate([
            'product_id' => 'required|integer',
        ]);

        $isWishlisted = Wishlist::where('user_id', $userId)
            ->where('product_id', $validated['product_id'])
            ->exists();

        return response()->json([
            'status' => true,
            'isWishlisted' => $isWishlisted,
        ]);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:product_details,id',
        ]);

        $deleted = Wishlist::where('user_id', $validated['user_id'])
            ->where('product_id', $validated['product_id'])
            ->delete();

        if ($deleted) {
            return response()->json([
                'status' => true,
                'message' => 'Đã xóa khỏi danh sách yêu thích.',
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Sản phẩm không có trong danh sách yêu thích.',
        ], 404);
    }
    public function wishlistCount(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized',
                'count' => 0
            ], 401);
        }

        $count = Wishlist::where('user_id', $user->id)->count();

        return response()->json([
            'status' => true,
            'message' => 'Wishlist count retrieved successfully',
            'count' => $count
        ], 200);
    }
}
