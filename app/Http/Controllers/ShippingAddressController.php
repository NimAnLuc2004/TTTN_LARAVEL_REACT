<?php

namespace App\Http\Controllers;

use App\Models\ShippingAddress;
use Illuminate\Http\Request;

class ShippingAddressController extends Controller
{
    public function index()
    {
        $ship = ShippingAddress::query()
            ->orderBy('created_at', 'ASC')
            ->select("id", "user_id", "address", "phone")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'ship' => $ship
        ];
        return response()->json($result);
    }

    public function destroy($id)
    {
        $ship = ShippingAddress::find($id);
        if ($ship == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'ship' => null
            ];
            return response()->json($result);
        }
        if ($ship->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'ship' => $ship
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'ship' => null
            ];
        }
        return response()->json($result);
    }
}
