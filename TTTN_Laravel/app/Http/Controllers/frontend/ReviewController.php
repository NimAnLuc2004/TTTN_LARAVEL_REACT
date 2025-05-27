<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review = Review::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        return response()->json(['status' => true, 'message' => 'Tạo review thành công', 'review' => $review]);
    }
    public function getByUser($user_id)
    {
        $reviews = Review::where('user_id', $user_id)->get();
        return response()->json(['status' => true, 'reviews' => $reviews]);
    }
    public function getByProductPaginated($product_id)
    {
        $reviews = Review::where('product_id', $product_id)
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();
        return response()->json(['status' => true, 'message' => 'Đã xóa review']);
    }
    public function averageRating($product_id)
    {
        $avg = Review::where('product_id', $product_id)->avg('rating');
        return response()->json(['status' => true, 'average_rating' => round($avg, 1)]);
    }
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review->update([
            ...$validated,
            'updated_by' => Auth::id(),
        ]);

        return response()->json(['status' => true, 'message' => 'Cập nhật thành công', 'review' => $review]);
    }
    
}
