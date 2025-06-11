<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;

class ShippingAddressController extends Controller
{
    public function index()
    {
        $ship = ShippingAddress::query()
            ->orderBy('created_at', 'DESC')
            ->select("id", "user_id", "address", "phone")
            ->paginate(10); 
    
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'ship' => $ship
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $address = ShippingAddress::find($id);
        if ($address == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'ship' => $address
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'ship' => $address
            ];
        }
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
        $idLog = $ship->id;
        $Data = $ship->toJson();
        if ($ship->delete()) {
            Log::create([
                'user_id' => null,
                'action' => 'destroy',
                'table_name' => 'shipp_address',
                'record_id' => $idLog,
                'description' => 'Xóa vĩnh viễn địa chỉ: ' . $Data,
            ]);
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
