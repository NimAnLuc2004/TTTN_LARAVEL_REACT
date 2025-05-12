<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::query()
            ->join('products', 'reviews.product_id', '=', 'products.id')
            ->orderBy('reviews.created_at', 'DESC')
            ->select('reviews.id', 'reviews.product_id', 'reviews.rating', 'products.name as product_name')
            ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'review' => $reviews
        ]);
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
        $idLog = $review->id;
        $Data = $review->toJson();
        if ($review->delete()) {
            Log::create([
                'user_id' => null,
                'action' => 'destroy',
                'table_name' => 'reviews',
                'record_id' => $idLog,
                'description' => 'Xóa vĩnh viễn reviews: ' . $Data,
            ]);
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
