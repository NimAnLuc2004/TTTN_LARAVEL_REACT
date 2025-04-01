<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $message = Message::query()
            ->orderBy('created_at', 'ASC')
            ->select("id", "chat_id", "sender_id","message")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'message' => $message
        ];
        return response()->json($result);
    }
    
    public function show($chat_id)
    {
        $message = Message::where('chat_id', $chat_id)->get(); 
    
        if ($message->isEmpty()) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'message' => null
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'message' => $message
            ];
        }
        
        return response()->json($result);
    }
    
    public function destroy($id)
    {
        $message = Message::find($id);
        if ($message == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'message' => null
            ];
            return response()->json($result);
        }
        if ($message->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'message' => $message
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'message' => null
            ];
        }
        return response()->json($result);
    }
}
