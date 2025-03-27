<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $review = Review::query()
            ->orderBy('created_at', 'ASC')
            ->select("id", "product_id", "rating")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'review' => $review
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $review = Review::find($id);
        if ($review == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'review' => $review
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'review' => $review
            ];
        }
        return response()->json($result);
    }
    public function destroy($id)
    {
        $review = Review::find($id);
        if ($review == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'review' => null
            ];
            return response()->json($result);
        }
        if ($review->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'review' => $review
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'review' => null
            ];
        }
        return response()->json($result);
    }
}
