<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        $message = Message::query()
            ->orderBy('created_at', 'DESC')
            ->select("id", "chat_id", "sender_id","message")
            ->paginate(10); 
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'message' => $message
        ];
        return response()->json($result);
    }
    public function show1($id)
    {
        $message = Message::find($id);
        if ($message == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'message' => $message
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
        $idLog = $message->id;
        $Data = $message->toJson();
        if ($message->delete()) {
            Log::create([
                'user_id' => Auth::id(),
                'action' => 'destroy',
                'table_name' => 'messages',
                'record_id' => $idLog,
                'description' => 'Xóa vĩnh viễn tin nhắn: ' . $Data,
            ]);
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
