<?php

namespace App\Http\Controllers;

use App\Models\NewsComment;
use Illuminate\Http\Request;

class NewCommentController extends Controller
{
    public function index()
    {
        $newcoms = NewsComment::query()
            ->orderBy('created_at', 'ASC')
            ->select("id", "user_id", "news_id", "comment")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'newcoms' => $newcoms
        ];
        return response()->json($result);
    }
    public function showuser($user_id)
    {
        $newcoms = NewsComment::where('user_id', $user_id)->get(); 
        if ($newcoms == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'newcoms' => $newcoms
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'newcoms' => $newcoms
            ];
        }
        return response()->json($result);
    }
    public function shownew($news_id)
    {
        $newcoms = NewsComment::where('news_id', $news_id)->get(); 
    
        if ($newcoms->isEmpty()) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'newcoms' => null
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'newcoms' => $newcoms
            ];
        }
        
        return response()->json($result);
    }
    public function destroy($id)
    {
        $newcoms = NewsComment::find($id);
        if ($newcoms == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'newcoms' => null
            ];
            return response()->json($result);
        }
        if ($newcoms->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'newcoms' => $newcoms
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'newcoms' => null
            ];
        }
        return response()->json($result);
    }
}
