<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:product_details,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $quantity = $validated['quantity'] ?? 1;

        // Tìm xem sản phẩm đã có trong giỏ hàng chưa
        $cartItem = Cart::where('user_id', $validated['user_id'])
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cartItem) {
            // Nếu đã có thì tăng số lượng
            $cartItem->quantity += $quantity;
            $cartItem->updated_at = now();
            $cartItem->save();

            return response()->json(['status' => true, 'message' => 'Đã cập nhật số lượng sản phẩm trong cart', 'data' => $cartItem]);
        }

        // Nếu chưa có thì tạo mới
        $item = Cart::create([
            'user_id' => $validated['user_id'],
            'product_id' => $validated['product_id'],
            'quantity' => $quantity,
            'created_by' => Auth::id(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['status' => true, 'message' => 'Đã thêm vào cart', 'data' => $item]);
    }
    public function getCartHistory()
    {

        // Lấy giỏ hàng của người dùng từ bảng Cart (có thể chưa thanh toán)
        $cartHistory = Cart::where('user_id', Auth::id())
            ->with(['product.product.images'])
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Lịch sử giỏ hàng',
            'data' => $cartHistory
        ]);
    }
    public function getDiscounts()
    {
        $today = now();
        $discounts = Discount::where('status', 1)
            ->where(function ($q) use ($today) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', $today);
            })
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Danh sách mã giảm giá',
            'data' => $discounts
        ]);
    }

    public function removeProductFromCart($productId)
    {


        // Xóa sản phẩm khỏi giỏ
        Cart::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();

        return response()->json([
            'status' => true,
            'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng'
        ]);
    }
    public function updateQuantityInCart(Request $request, $productId)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::where('user_id', Auth::id())->where('product_id', $productId)->first();

        if ($cart) {
            $cart->quantity = $validated['quantity'];
            $cart->save();

            return response()->json([
                'status' => true,
                'message' => 'Số lượng sản phẩm đã được cập nhật',
                'data' => $cart
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Sản phẩm không có trong giỏ hàng'
        ], 400);
    }
    public function cartCount(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        return response()->json([
            'status' => false,
            'message' => 'Unauthorized',
            'count' => 0
        ], 401);
    }

    $count = Cart::where('user_id', $user->id)->count();

    return response()->json([
        'status' => true,
        'message' => 'Cart count retrieved successfully',
        'count' => $count
    ], 200);
}
}
