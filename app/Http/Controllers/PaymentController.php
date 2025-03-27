<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function pending()
    {
        $payment = Payment::where('status', '=', 'pending')
            ->orderBy('created_at', 'ASC')
            ->select("id", "order_id", "payment_method", "status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'payment' => $payment
        ];
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
        if ($payment->delete()) {
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
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "image", "status")
            ->get();
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
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "image", "status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'payment' => $payment
        ];
        return response()->json($result);
    }
}
