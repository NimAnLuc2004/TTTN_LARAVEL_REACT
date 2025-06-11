<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\NewsTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NewTopicController extends Controller
{
    public function index()
    {
        $topic = NewsTopic::query()
            ->orderBy('created_at', 'DESC')
            ->select("id", "name")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'topic' => $topic
        ];
        return response()->json($result);
    }
    public function create(Request $request)
    {
        $topic = new NewsTopic();
        $topic->name = $request->name;
        $topic->created_at = now();
        // $topic->created_by = Auth::id();
        if ($topic->save()) {
            Log::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'table_name' => 'newstopics',
                'record_id' => $topic->id,
                'description' => 'Tạo topic mới ',
            ]);
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'topic' => $topic
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'topic' => null
            ];
        }
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'topic' => $topic
        ];
        return response()->json($result);
    }
    public function destroy($id)
    {
        $topic = NewsTopic::find($id);
        if ($topic == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'topic' => null
            ];
            return response()->json($result);
        }
        if ($topic->delete()) {
            $topicJson = $topic->toJson();
            Log::create([
                'user_id' => Auth::id(),
                'action' => 'destroy',
                'table_name' => 'newstopics',
                'record_id' => $topic->id,
                'description' => 'Xóa vĩnh viễn topic: ' . $topicJson,
            ]);
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'topic' => $topic
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'topic' => null
            ];
        }
        return response()->json($result);
    }
}
