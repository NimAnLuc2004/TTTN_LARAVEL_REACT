<?php

namespace App\Http\Controllers;

use App\Models\NewsCommentReaction;
use Illuminate\Http\Request;

class NewCommentReactionController extends Controller
{
    public function index()
    {
        $newreacts = NewsCommentReaction::query()
            ->orderBy('created_at', 'DESC')
            ->select("id", "user_id", "comment_id", "reaction")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'newreacts' => $newreacts
        ];
        return response()->json($result);
    }
    public function showuser($user_id)
    {
        $newreacts = NewsCommentReaction::where('user_id', $user_id)->get(); 
        if ($newreacts == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'newreacts' => $newreacts
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'newreacts' => $newreacts
            ];
        }
        return response()->json($result);
    }
    public function showcomment($comment_id)
    {
        $newreacts = NewsCommentReaction::where('comment_id', $comment_id)->get(); 
        if ($newreacts == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'newreacts' => $newreacts
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'newreacts' => $newreacts
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $newreacts = NewsCommentReaction::find($id);
        if ($newreacts == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'newreacts' => null
            ];
            return response()->json($result);
        }
        if ($newreacts->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'newreacts' => $newreacts
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'newreacts' => null
            ];
        }
        return response()->json($result);
    }
}
