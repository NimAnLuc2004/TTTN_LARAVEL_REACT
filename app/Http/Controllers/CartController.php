<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::query()
            ->orderBy('created_at', 'ASC')
            ->select("id", "user_id", "product_id", "quantity")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'cart' => $cart
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $cart = Cart::find($id);

        if ($cart == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'cart' => $cart
            ];
        } else {
            // Truy vấn tên sản phẩm từ bảng Product
            $product = Product::find($cart->product_id);
            $productName = $product ? $product->name : null; // Lấy tên sản phẩm

            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'cart' => $cart,
                'product_name' => $productName
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $cart = Cart::find($id);
        if ($cart == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'cart' => null
            ];
            return response()->json($result);
        }
        if ($cart->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'cart' => $cart
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'cart' => null
            ];
        }
        return response()->json($result);
    }
}
