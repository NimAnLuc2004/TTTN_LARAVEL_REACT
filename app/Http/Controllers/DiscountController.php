<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    public function index()
    {
        $discount = Discount::query()
            ->orderBy('created_at', 'ASC')
            ->select("id", "code", "discount_percent","valid_until")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'discount' => $discount
        ];
        return response()->json($result);
    }



    public function destroy($id)
    {
        $discount = Discount::find($id);
        if ($discount == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'discount' => null
            ];
            return response()->json($result);
        }
        if ($discount->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'discount' => $discount
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'discount' => null
            ];
        }
        return response()->json($result);
    }
    public function store(Request $request)
    {

        $discount = new Discount();
        $discount->code =  $request->code;
        $discount->discount_percent =  $request->discount_percent;

        $discount->valid_until =  $request->valid_until;
        $discount->created_at =  date('Y-m-d H:i:s');
        if ($discount->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'discount' => $discount
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'discount' => null
            ];
        }
        return response()->json($result);
    }
    public function update(Request $request, $id)
    {
        $discount = Discount::find($id);
        if ($discount == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'discount' => null
            ];
            return response()->json($result);
        }
        $discount->code =  $request->code;
        $discount->discount_percent =  $request->discount_percent;

        $discount->valid_until =  $request->valid_until;
        $discount->updated_at =  date('Y-m-d H:i:s');
        if ($discount->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'discount' => $discount
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'discount' => null
            ];
        }
        return response()->json($result);
    }
}
