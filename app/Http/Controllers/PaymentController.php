<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    private function writeLog($action, $table, $recordId, $description)
    {
        Log::create([
            'user_id' => Auth::id() ,
            'action' => $action,
            'table_name' => $table,
            'record_id' => $recordId,
            'description' => $description,
        ]);
    }
    public function pending()
    {
        $payment = Payment::where('status', '=', 'pending')
            ->orderBy('created_at', 'DESC')
            ->select("id", "order_id", "payment_method", "status")
            ->paginate(10);
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'payment' => $payment
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $payment = Payment::find($id);
        if ($payment == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'payment' => $payment
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'payment' => $payment
            ];
        }
        return response()->json($result);
    }
    public function destroy($id)
    {
        $payment = Payment::find($id);
        if ($payment == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'payment' => null
            ];
            return response()->json($result);
        }
        $idLog = $payment->id;
        $Data = $payment->toJson();
        if ($payment->delete()) {
            $this->writeLog('destroy', 'payments', $idLog, 'Xóa thanh toán: ' . $Data);
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'payment' => $payment
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'payment' => null
            ];
        }
        return response()->json($result);
    }
    public function completed()
    {
        $payment = Payment::where('status', '=', 'completed')
            ->orderBy('created_at', 'DESC')
            ->select("id", "order_id", "payment_method", "status")
            ->paginate(10);
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'payment' => $payment
        ];
        return response()->json($result);
    }
    public function failed()
    {
        $payment = Payment::where('status', '=', 'failed')
            ->orderBy('created_at', 'DESC')
            ->select("id", "order_id", "payment_method", "status")
            ->paginate(10);
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'payment' => $payment
        ];
        return response()->json($result);
    }
}
