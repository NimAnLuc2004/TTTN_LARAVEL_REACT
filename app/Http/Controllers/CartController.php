<?php

namespace App\Http\Controllers;
use App\Models\Cart;
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
