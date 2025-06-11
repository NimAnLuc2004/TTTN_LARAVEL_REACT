<?php

namespace App\Http\Controllers;

use App\Models\UserDiscount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserDiscountController extends Controller
{


    public function index(Request $request)
    {
        $userDiscounts = UserDiscount::with(['user', 'discount'])
            ->paginate($request->input('per_page', 10));

        return response()->json([
            'status' => true,
            'data' => $userDiscounts->items(),
            'pagination' => [
                'current_page' => $userDiscounts->currentPage(),
                'last_page' => $userDiscounts->lastPage(),
                'per_page' => $userDiscounts->perPage(),
                'total' => $userDiscounts->total(),
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'discount_id' => 'required|exists:discounts,id',
            'status' => 'required|in:0,1',
            'is_select_all' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        // Nếu không phải select all, kiểm tra trùng lặp
        if (!$request->input('is_select_all', false)) {
            $exists = UserDiscount::where('user_id', $request->user_id)
                ->where('discount_id', $request->discount_id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'status' => false,
                    'message' => 'Mã giảm giá đã được gán cho người dùng này.',
                ], 422);
            }
        }

        // Sử dụng firstOrCreate để tránh trùng lặp
        $userDiscount = UserDiscount::firstOrCreate(
            [
                'user_id' => $request->user_id,
                'discount_id' => $request->discount_id,
            ],
            [
                'status' => $request->status,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        return response()->json([
            'status' => true,
            'data' => $userDiscount,
            'message' => $userDiscount->wasRecentlyCreated
                ? 'Thêm mã giảm giá cho người dùng thành công.'
                : 'Mã giảm giá đã tồn tại cho người dùng này.',
        ], $userDiscount->wasRecentlyCreated ? 201 : 200);
    }


    public function update(Request $request, $id)
    {
        $userDiscount = UserDiscount::find($id);

        if (!$userDiscount) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bản ghi.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|exists:users,id',
            'discount_id' => 'sometimes|exists:discounts,id',
            'status' => 'sometimes|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        if ($request->has('user_id') || $request->has('discount_id')) {
            $exists = UserDiscount::where('user_id', $request->user_id ?? $userDiscount->user_id)
                ->where('discount_id', $request->discount_id ?? $userDiscount->discount_id)
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'status' => false,
                    'message' => 'Mã giảm giá đã được gán cho người dùng này.',
                ], 422);
            }
        }

        $userDiscount->update($request->only(['user_id', 'discount_id', 'status']));

        return response()->json([
            'status' => true,
            'data' => $userDiscount,
            'message' => 'Cập nhật thành công.',
        ], 200);
    }
    public function show($id)
    {
        $userDiscount = UserDiscount::with(['user', 'discount'])->find($id);

        if (!$userDiscount) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bản ghi.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $userDiscount,
        ], 200);
    }
    public function destroy($id)
    {
        $userDiscount = UserDiscount::find($id);

        if (!$userDiscount) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bản ghi.',
            ], 404);
        }

        $userDiscount->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa thành công.',
        ], 200);
    }
}
