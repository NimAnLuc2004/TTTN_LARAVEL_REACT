<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function message(Request $request)
    {
        $user1 = $request->user1_id;
        $user2 = $request->user2_id;

        // Tìm cuộc trò chuyện giữa 2 người (không phân biệt ai là user1 hay user2)
        $chat = Chat::where(function ($query) use ($user1, $user2) {
            $query->where('user1_id', $user1)->where('user2_id', $user2);
        })->orWhere(function ($query) use ($user1, $user2) {
            $query->where('user1_id', $user2)->where('user2_id', $user1);
        })->first();

        // Nếu chưa có cuộc trò chuyện thì tạo mới
        if (!$chat) {
            $chat = new Chat();
            $chat->user1_id = $user1;
            $chat->user2_id = $user2;
            $chat->save();
        }


        $message = new Message();
        $message->chat_id = $chat->id;
        $message->sender_id = $request->sender_id;
        $message->message = $request->message;
        $message->created_at = now();
        $message->save();

        $result = [
            'status' => true,
            'message' => 'Gửi tin nhắn thành công',
            'data' => $message
        ];

        return response()->json($result);
    }
    public function getMessagesByUser($user_id)
    {
        // Lấy tất cả các cuộc trò chuyện liên quan đến user
        $chats = Chat::where('user1_id', $user_id)
            ->orWhere('user2_id', $user_id)
            ->with(['messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }, 'user1', 'user2'])
            ->get();

        return response()->json([
            'status' => true,
            'data' => $chats
        ]);
    }
    public function getUser(Request $request)
    {
        $query = User::where('status', '=', 1)
            ->orderBy('created_at', 'DESC')
            ->select("id", "name", "image");

        if ($request->has('page')) {
            $users = $query->paginate(10);
        } else {
            $users = $query->get();
        }
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'users' => $users
        ];
        return response()->json($result);
    }
    public function getMessagesByChat($chat_id)
    {
        try {
            // Kiểm tra xem chat_id có tồn tại
            $chat = Chat::find($chat_id);
            if (!$chat) {
                return response()->json([
                    'status' => false,
                    'message' => 'Chat not found'
                ], 404);
            }

            // Lấy tất cả tin nhắn thuộc chat_id, sắp xếp theo created_at
            $messages = Message::where('chat_id', $chat_id)
                ->orderBy('created_at', 'asc')
                ->get();

            return response()->json([
                'status' => true,
                'data' => $messages
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching messages: ' . $e->getMessage()
            ], 500);
        }
    }
}
