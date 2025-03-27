<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $noti = Notification::query()
            ->orderBy('created_at', 'ASC')
            ->select("id", "user_id", "message")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'noti' => $noti
        ];
        return response()->json($result);
    }
    public function destroy($id)
    {
        $noti = Notification::find($id);
        if ($noti == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'noti' => null
            ];
            return response()->json($result);
        }
        if ($noti->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'noti' => $noti
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'noti' => null
            ];
        }
        return response()->json($result);
    }
    public function store(Request $request)
    {

        $noti = new Notification();
        $noti->user_id =  $request->user_id;
        $noti->message	 =  $request->message;
        $noti->created_at =  date('Y-m-d H:i:s');
        if ($noti->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'noti' => $noti
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'noti' => null
            ];
        }
        return response()->json($result);
    }
    public function update(Request $request, $id)
    {
        $noti = Notification::find($id);
        if ($noti == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'noti' => null
            ];
            return response()->json($result);
        }
        $noti->user_id =  $request->user_id;
        $noti->message	 =  $request->message;
        $noti->updated_at =  date('Y-m-d H:i:s');
        if ($noti->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'noti' => $noti
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'noti' => null
            ];
        }
        return response()->json($result);
    }
}
