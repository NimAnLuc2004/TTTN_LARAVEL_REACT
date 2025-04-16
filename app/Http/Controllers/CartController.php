<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Log;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::query()
            ->join('products', 'carts.product_id', '=', 'products.id') // sửa ở đây
            ->orderBy('carts.created_at', 'DESC')
            ->select(
                'carts.id',
                'carts.user_id',
                'carts.product_id',
                'carts.quantity',
                'products.name as product_name',
            )
            ->paginate(10); 

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
        $idLog = $cart->id;
        $Data = $cart->toJson();
        if ($cart->delete()) {
            Log::create([
                'user_id' => Auth::id(),
                'action' => 'destroy',
                'table_name' => 'carts',
                'record_id' => $idLog,
                'description' => 'Xóa vĩnh viễn carts: ' . $Data,
            ]);
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
