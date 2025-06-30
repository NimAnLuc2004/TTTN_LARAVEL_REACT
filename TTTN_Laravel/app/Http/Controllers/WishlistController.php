<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index()
    {
        $wish = Wishlist::query()
            ->join('users', 'users.id', '=', 'wishlists.user_id')
            ->join('products', 'products.id', '=', 'wishlists.product_id')
            ->orderBy('wishlists.created_at', 'DESC')
            ->select(
                'wishlists.id',
                'wishlists.user_id',
                'wishlists.product_id',
                'users.name as user_name',
                'products.name as product_name',

            )
            ->paginate(10);

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'wishlist' => $wish
        ];

        return response()->json($result);
    }

    public function show($id)
    {
        $wishlist = Wishlist::with('product')->find($id);

        if (!$wishlist) {
            return response()->json(['status' => false, 'message' => 'Danh sách yêu thích không tồn tại.'], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'wishlist' => $wishlist
        ]);
    }

    public function destroy($id)
    {
        $wish = Wishlist::find($id);
        if ($wish == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'wishlist' => null
            ];
            return response()->json($result);
        }
        $idLog = $wish->id;
        $Data = $wish->toJson();
        if ($wish->delete()) {
            Log::create([
                'user_id' => null,
                'action' => 'destroy',
                'table_name' => 'wishlist',
                'record_id' => $idLog,
                'description' => 'Xóa vĩnh viễn danh sách yêu thích: ' . $Data,
            ]);
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'wishlist' => $wish
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'wishlist' => null
            ];
        }
        return response()->json($result);
    }
}
