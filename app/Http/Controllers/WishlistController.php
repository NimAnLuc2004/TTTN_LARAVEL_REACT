<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index()
    {
        $wish = Wishlist::query()
            ->orderBy('created_at', 'ASC')
            ->select("id", "user_id", "product_id")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'wish' => $wish
        ];
        return response()->json($result);
    }
    public function destroy($id)
    {
        $wish = Wishlist::find($id);
        if ($wish == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'wish' => null
            ];
            return response()->json($result);
        }
        if ($wish->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'wish' => $wish
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'wish' => null
            ];
        }
        return response()->json($result);
    }
}
