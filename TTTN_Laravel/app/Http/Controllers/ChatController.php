<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        $chat = Chat::query()
            ->orderBy('created_at', 'DESC')
            ->select("id", "user1_id", "user1_id")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'chat' => $chat
        ];
        return response()->json($result);
    }

    public function destroy($id)
    {
        $chat = Chat::find($id);
        if ($chat == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'chat' => null
            ];
            return response()->json($result);
        }
        if ($chat->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'chat' => $chat
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'chat' => null
            ];
        }
        return response()->json($result);
    }
}
