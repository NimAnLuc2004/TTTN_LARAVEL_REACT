<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
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
    public function index(Request $request)
    {
        $limit = $request->input('limit', 10);
        $noti = Notification::query()
            ->orderBy('created_at', 'DESC')
            ->select("id", "user_id", "message","role")
            ->paginate($limit);
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'noti' => $noti
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $notification = Notification::find($id);
        if ($notification == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'noti' => $notification
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'noti' => $notification
            ];
        }
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
        $idLog = $noti->id;
        $notiData = $noti->toJson();
        if ($noti->delete()) {
            $this->writeLog('destroy', 'notifications', $idLog, 'Xóa vĩnh viễn thông báo:' . $notiData);
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
        $noti->role     =  $request->role;
        $noti->message     =  $request->message;
        $noti->created_at =  date('Y-m-d H:i:s');
        $noti->created_by = Auth::id();
        if ($noti->save()) {
            $this->writeLog('create', 'notifications', $noti->id, 'Thêm thông báo');
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
        $noti->role     =  $request->role;
        $noti->message     =  $request->message;
        $noti->updated_by = Auth::id();
        $noti->updated_at =  date('Y-m-d H:i:s');
        if ($noti->save()) {
            $this->writeLog('update', 'notifications', $noti->id, 'Cập nhật thông báo:' . $noti->toJson());
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
