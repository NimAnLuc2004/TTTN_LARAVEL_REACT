<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiscountController extends Controller
{
    private function writeLog($action, $table, $recordId, $description)
    {
        Log::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'table_name' => $table,
            'record_id' => $recordId,
            'description' => $description,
        ]);
    }
    public function index()
    {
        $discount = Discount::where('status', '!=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "code", "discount_percent","status")
            ->paginate(10); 
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'discount' => $discount
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $discount = Discount::find($id);
        if ($discount == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'discount' => $discount
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'discount' => $discount
            ];
        }
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
        $idLog = $discount->id;
        $discountData = $discount->toJson();
        if ($discount->delete()) {
            $this->writeLog('destroy', 'discounts', $idLog, 'Xóa hoàn toàn mã giảm giá: ' . $discountData);
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
        $discount->status =  $request->status;
        $discount->valid_until =  $request->valid_until;
        $discount->created_by =  Auth::id();
        $discount->created_at =  date('Y-m-d H:i:s');
        if ($discount->save()) {
             $this->writeLog('create', 'discounts', $discount->id, 'Thêm mới mã giảm giá');
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
        $discount->status =  $request->status;
        $discount->valid_until =  $request->valid_until;
        $discount->updated_by =  Auth::id();
        $discount->updated_at =  date('Y-m-d H:i:s');
        if ($discount->save()) {
            $this->writeLog('update', 'discounts', $discount->id, 'Cập nhật mã giảm giá: ' . $discount->toJson());
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
    public function trash()
    {
        $discounts = Discount::where('status', '=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "code", "discount_percent","status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'discount' => $discounts
        ];
        return response()->json($result);
    }
    public function status($id)
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
        $discount->status = ($discount->status == 1) ? 2 : 1;
        $discount->updated_at =  date('Y-m-d H:i:s');
        $discount->updated_by =  Auth::id();
        if ($discount->save()) {
            $this->writeLog('status', 'discounts', $discount->id, 'Thay đổi trạng thái mã giảm giá');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'discount' => $discount
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'discount' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
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
        $discount->status = 0;
        $discount->updated_at =  date('Y-m-d H:i:s');
        $discount->updated_by =  Auth::id();
        if ($discount->save()) {
            $this->writeLog('delete', 'discounts', $discount->id, 'Chuyển mã giảm giá vào thùng rác');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'discount' => $discount
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'discount' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
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
        $discount->status = 2;
        $discount->updated_at =  date('Y-m-d H:i:s');
        $discount->updated_by =  Auth::id();
        if ($discount->save()) {
            $this->writeLog('restore', 'discounts', $discount->id, 'Khôi phục mã giảm giá từ thùng rác');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'discount' => $discount
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'discount' => null
            ];
        }
        return response()->json($result);
    }
}
