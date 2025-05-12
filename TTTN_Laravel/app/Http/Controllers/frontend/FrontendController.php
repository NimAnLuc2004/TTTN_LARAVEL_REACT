<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Contact;
use App\Models\Discount;
use App\Models\Log;
use App\Models\Notification;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Log as Logger;

class FrontendController extends Controller
{
    public function banner_list()
    {
        $banner_list = Banner::where('status', '=', 1)
            ->orderBy('sort_order', 'ASC')
            ->select('name', 'id', 'link', 'image', 'description')
            ->get();

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'banner_list' => $banner_list
        ];
        return response()->json($result);
    }
    public function notification()
    {
        $userId = Auth::id();
        $notification = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'DESC')
            ->select('user_id', 'id', 'message', 'created_at', 'created_by')
            ->get();

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'notification' => $notification
        ];

        return response()->json($result);
    }
    public function store(Request $request)
    {
        // Xác thực dữ liệu với thông báo tùy chỉnh
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:contacts,email',
            'phone' => 'nullable|string|max:20',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
        ], [
            'email.unique' => 'This email is already subscribed.',
            'email.required' => 'Please provide an email address.',
            'email.email' => 'Please provide a valid email address.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(), // Lấy lỗi đầu tiên
                'errors' => $validator->errors(),
            ], 422);
        }

        // Lưu thông tin contact
        $contact = new Contact();
        $contact->name = $request->name;
        $contact->email = $request->email;
        $contact->phone = $request->phone;
        $contact->title = $request->title;
        $contact->content = $request->content;
        $contact->status = 1; // Mặc định active
        $contact->user_id = Auth::id(); // ID người dùng nếu có
        $contact->updated_by = Auth::id();
        $contact->created_at = now();

        if ($contact->save()) {
            // Ghi log (nếu có bảng logs)
            Log::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'table_name' => 'contacts',
                'record_id' => $contact->id,
                'description' => 'Tạo contact mới với email: ' . $contact->email,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Subscription successful',
                'contact' => $contact,
            ], 201);
        }

        return response()->json([
            'status' => false,
            'message' => 'Failed to subscribe',
            'contact' => null,
        ], 500);
    }



    ///
    public function getReview()
    {
        // Lấy đánh giá gần đây nhất với user và product (bao gồm images)
        $review = Review::with(['user', 'product.images'])->latest()->first();

        if (!$review || !$review->user) {
            return response()->json([
                'status' => false,
                'message' => 'No reviews found or user not found.',
                'data' => null,
            ], 404);
        }

        // Lấy hình ảnh đầu tiên, ưu tiên user.image, sau đó product.images
        $imageUrl = null;
        if ($review->user->image) {
            try {
                // Kiểm tra kiểu dữ liệu của $review->user->image
                $imageArray = is_string($review->user->image) ? json_decode($review->user->image, true) : $review->user->image;

                // Kiểm tra nếu $imageArray là mảng và không rỗng
                if (is_array($imageArray) && !empty($imageArray)) {
                    $imageUrl = asset('images/user/' . $imageArray[0]);
                } else {
                    Logger::error('Invalid image data for user: ' . $review->user->id, ['image' => $review->user->image]);
                }
            } catch (\Exception $e) {
                // Ghi log lỗi nếu có vấn đề khi xử lý dữ liệu
                Logger::error('Error processing user.image: ' . $e->getMessage(), ['image' => $review->user->image]);
            }
        } elseif ($review->product && $review->product->images->first()) {
            $imageUrl = asset('images/product/' . $review->product->images->first()->image_url);
        }

        return response()->json([
            'status' => true,
            'message' => 'Review retrieved successfully.',
            'data' => [
                'name' => $review->user->name ?? 'Anonymous',
                'title' => 'Customer', // Mặc định
                'description' => $review->comment,
                'image_url' => $imageUrl,
            ],
        ], 200);
    }

    public function getDiscount()
    {
        $discount = Discount::where('status', 1) // Chỉ lấy discount đang hoạt động
            ->where('valid_until', '>=', Carbon::now())
            ->latest()
            ->first();
        if (!$discount) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy ưu đãi nào đang hoạt động.',
                'data' => null,
            ], 200); // Thay 404 thành 200 để frontend dễ xử lý
        }

        return response()->json([
            'status' => true,
            'message' => 'Discount retrieved successfully.',
            'data' => [
                'title' => 'Special Offer',
                'description' => "Use code {$discount->code}, valid until " . \Carbon\Carbon::parse($discount->valid_until)->format('Y-m-d'),
                'discount' => number_format($discount->discount_percent, 0) . '% Discount',
                'image_url' => null,
            ],
        ], 200);
    }

    //
    public function index()
    {
        try {
            $discounts = Discount::whereIn('status', [0, 1])->get()->map(function ($discount) {
                return [
                    'id' => $discount->id,
                    'code' => $discount->code,
                    'description' => "Giảm {$discount->discount_percent}% cho đơn hàng",
                    'expiry_date' => $discount->valid_until->format('Y-m-d'),
                    'status' => $discount->status,
                ];
            });

            return response()->json([
                'status' => true,
                'discounts' => $discounts,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể tải danh sách discount: ' . $e->getMessage(),
            ], 500);
        }
    }
    //thông báo
    public function index1()
    {
        try {
            $notifications = Notification::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'message' => $notification->message,
                        'date' => $notification->created_at->format('Y-m-d'),
                    ];
                });

            return response()->json([
                'status' => true,
                'notifications' => $notifications,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể tải danh sách thông báo: ' . $e->getMessage(),
            ], 500);
        }
    }

    //
    
}
