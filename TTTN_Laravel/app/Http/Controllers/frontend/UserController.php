<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\Order;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log as Logger;
use Google\Client as GoogleClient;
use Illuminate\Support\Str;

class OrderStatus
{
    const PROCESSING = 'pending';
    const CANCELLED = 'cancelled';
}

class UserController extends Controller
{
    public function loginuser(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        // Tìm user theo email
        $user = User::where('email', $request->email)->first();

        if (!empty($user)) {
            // Kiểm tra status
            if ($user->status !== 1) {
                return response()->json([
                    "status" => false,
                    "message" => "Tài khoản của bạn đã bị khóa hoặc không hoạt động!"
                ]);
            }

            // Kiểm tra role
            if ($user->role !== 'admin') {
                return response()->json([
                    "status" => false,
                    "message" => "Bạn không có quyền truy cập!"
                ]);
            }

            // Kiểm tra password
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken("myToken")->plainTextToken;
                Log::create([
                    'user_id' => $user->id,
                    'action' => 'login',
                    'table_name' => 'users',
                    'record_id' => $user->id,
                    'description' => 'Đăng nhập thành công',
                ]);
                return response()->json([
                    "status" => true,
                    "message" => "Logged in successfully",
                    "token" => $token,
                    "user" => $user
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Mật khẩu không đúng"
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Email không hợp lệ"
            ]);
        }
    }
    public function customer_register(Request $request)
    {
        // Kiểm tra xem email có tồn tại trong hệ thống không
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Email đã tồn tại.',
            ]);
        }

        // Tạo mới người dùng
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);


        $user->role = 'user';
        $user->status = 1; // Có thể để trạng thái mặc định là '1' (hoạt động)
        $user->created_by = 1; // Người tạo là người đang đăng nhập
        $user->created_at = now(); // Thời gian tạo là thời gian hiện tại

        $images = [];

        // Kiểm tra và xử lý ảnh đại diện nếu có
        if ($request->hasFile('image')) {
            foreach ($request->file('image') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') . '_' . uniqid() . '.' . $exten;
                $image->move(public_path('image/user'), $imageName);
                $images[] = $imageName;
            }
            $user->image = json_encode($images);
        } else {
            // Trả về lỗi nếu không có ảnh
            return response()->json(['status' => false, 'message' => 'Không có hình ảnh nào được tải lên.']);
        }

        // Lưu thông tin người dùng
        if ($user->save()) {
            // Thêm địa chỉ giao hàng cho người dùng mới tạo
            $address = new ShippingAddress();
            $address->user_id = $user->id;
            $address->address = $request->address;
            $address->phone = $request->phone;
            $address->created_at = now();
            $address->created_by = Auth::id(); // Người tạo là người đang đăng nhập
            if ($address->save()) {
                // Địa chỉ giao hàng được lưu thành công
                $result = [
                    'status' => true,
                    'message' => 'Đăng ký và thêm địa chỉ thành công!',
                    'user' => $user,
                    'address' => $address
                ];
            } else {
                // Nếu lưu địa chỉ thất bại, xóa người dùng đã tạo
                $user->delete();
                $result = [
                    'status' => false,
                    'message' => 'Không thể lưu địa chỉ giao hàng. Người dùng đã bị xóa!',
                    'user' => null
                ];
            }
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể đăng ký người dùng.',
                'user' => null
            ];
        }

        return response()->json($result);
    }
    // New getUserProfile method
    public function getUserProfile(Request $request)
    {
        try {
            // Lấy người dùng đã xác thực
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng hoặc chưa đăng nhập.'
                ], 401);
            }

            // Lấy địa chỉ giao hàng của người dùng
            $shippingAddress = ShippingAddress::where('user_id', $user->id)->first();

            // Trả về hồ sơ người dùng
            return response()->json([
                'status' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $shippingAddress ? $shippingAddress->phone : '',
                    'address' => $shippingAddress ? $shippingAddress->address : '',
                    'image' => $user->image ?? json_encode([]), // Chuỗi JSON chứa tên tệp ảnh
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể tải thông tin người dùng: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            // Lấy người dùng đã xác thực
            /** @var \App\Models\User $user */
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng hoặc chưa đăng nhập.'
                ], 401);
            }

            // Xác thực đầu vào
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
                'phone' => 'nullable|string|regex:/^[0-9]{10}$/',
                'address' => 'nullable|string|max:500',
                'image.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Tối đa 2MB mỗi ảnh
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            // Cập nhật dữ liệu người dùng
            $user->name = $request->name;
            $user->email = $request->email;

            // Xử lý tải ảnh lên
            $images = is_array($user->image) ? $user->image : (is_string($user->image) ? json_decode($user->image, true) : []);

            if ($request->hasFile('image')) {
                // Xóa ảnh cũ nếu có
                if ($user->image) {
                    $oldImages = is_array($user->image) ? $user->image : (is_string($user->image) ? json_decode($user->image, true) : []);
                    foreach ($oldImages as $oldImage) {
                        $oldImagePath = public_path('images/user/' . $oldImage);
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath);
                        }
                    }
                }

                // Lưu ảnh mới
                $images = [];
                foreach ($request->file('image') as $image) {
                    if (in_array($image->extension(), ['jpg', 'jpeg', 'png', 'webp'])) {
                        $imageName = time() . '_' . uniqid() . '.' . $image->extension();
                        $image->move(public_path('images/user'), $imageName);
                        $images[] = $imageName;
                    }
                }
                $user->image = $images; // Lưu trực tiếp mảng vào cột json
            } // Nếu không có ảnh mới, giữ $images hiện tại

            // Lưu người dùng
            $userSaved = $user->save();

            // Cập nhật hoặc tạo địa chỉ giao hàng
            $shippingAddress = ShippingAddress::where('user_id', $user->id)->first();
            if ($shippingAddress) {
                $shippingAddress->phone = $request->phone ?? '';
                $shippingAddress->address = $request->address ?? '';
                $shippingAddress->updated_by = Auth::id();
                $shippingAddress->updated_at = now();
                $addressSaved = $shippingAddress->save();
            } else {
                $shippingAddress = new ShippingAddress();
                $shippingAddress->user_id = $user->id;
                $shippingAddress->phone = $request->phone ?? '';
                $shippingAddress->address = $request->address ?? '';
                $shippingAddress->created_by = Auth::id();
                $shippingAddress->created_at = now();
                $addressSaved = $shippingAddress->save();
            }

            // Kiểm tra kết quả lưu
            if ($userSaved && $addressSaved) {
                // Ghi log hành động cập nhật
                Log::create([
                    'user_id' => $user->id,
                    'action' => 'update',
                    'table_name' => 'users',
                    'record_id' => $user->id,
                    'description' => 'Cập nhật hồ sơ người dùng và địa chỉ giao hàng thành công',
                ]);

                // Trả về user.image dưới dạng mảng
                return response()->json([
                    'status' => true,
                    'message' => 'Cập nhật hồ sơ thành công!',
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $request->phone ?? '',
                        'address' => $request->address ?? '',
                        'image' => $images, // Trả về mảng
                    ]
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể cập nhật hồ sơ hoặc địa chỉ.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
    public function updateAccount(Request $request)
    {
        try {
            // Lấy người dùng đã xác thực
            /** @var \App\Models\User $user */
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng hoặc chưa đăng nhập.'
                ], 401);
            }

            // Xác thực đầu vào
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            // Kiểm tra mật khẩu hiện tại
            if (empty($user->password) || !Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Mật khẩu hiện tại không đúng.'
                ], 422);
            }

            // Cập nhật email và mật khẩu
            $user->email = $request->email;
            $user->password = Hash::make($request->new_password);

            // Thử lưu người dùng
            if (!$user->save()) {
                Logger::error('Không thể lưu người dùng', [
                    'user_id' => $user->id,
                    'email' => $request->email,
                ]);
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể cập nhật tài khoản do lỗi lưu dữ liệu.'
                ], 500);
            }

            // Ghi log hành động
            try {
                Log::create([
                    'user_id' => $user->id,
                    'action' => 'update',
                    'table_name' => 'users',
                    'record_id' => $user->id,
                    'description' => 'Cập nhật email và mật khẩu thành công',
                ]);
            } catch (\Exception $logException) {
                Logger::warning('Không thể ghi log cập nhật tài khoản', [
                    'user_id' => $user->id,
                    'error' => $logException->getMessage(),
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật tài khoản thành công!'
            ]);
        } catch (\Exception $e) {
            Logger::error('Lỗi trong updateAccount', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id() ?? null,
                'request' => $request->all(),
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getOrders(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng hoặc chưa đăng nhập.'
                ], 401);
            }

            // Lấy tham số phân trang và lọc
            $perPage = $request->query('per_page', 10);
            $ordersQuery = Order::where('user_id', $user->id)
                ->select(['id', 'created_at', 'total', 'status', 'user_id'])
                ->orderBy("created_at", "DESC")
                ->with([
                    'orderItems.product.product.images', // Sửa lại quan hệ
                    'user'
                ]);

            // Lọc theo trạng thái nếu có
            if ($request->has('status') && $request->query('status') !== 'Tất cả') {
                $ordersQuery->where('status', $request->query('status'));
            }

            // Phân trang
            $orders = $ordersQuery->paginate($perPage);

            // Kiểm tra nếu không có đơn hàng
            if ($orders->isEmpty()) {
                Logger::info('Không tìm thấy đơn hàng cho người dùng', ['user_id' => $user->id]);
                return response()->json([
                    'status' => true,
                    'data' => [],
                    'pagination' => [
                        'current_page' => $orders->currentPage(),
                        'last_page' => $orders->lastPage(),
                        'total' => $orders->total(),
                    ],
                    'message' => 'Không tìm thấy đơn hàng.'
                ]);
            }

            // Ánh xạ dữ liệu
            $formattedOrders = $orders->map(function ($order) use ($user) {
                // Lấy địa chỉ giao hàng từ user
                $shippingAddress = null;
                if (method_exists($user, 'shippingAddresses')) {
                    $shippingAddress = $user->shippingAddresses->firstWhere('is_default', true)
                        ?? $user->shippingAddresses->first();
                }

                return [
                    'id' => (string) $order->id,
                    'date' => $order->created_at ? $order->created_at->format('Y-m-d') : '',
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'shippingAddress' => $shippingAddress ? $shippingAddress->address : '',
                    'items' => $order->orderItems->map(function ($item) {
                        $image = 'https://via.placeholder.com/50?text=San+Pham';
                        if ($item->product && $item->product->product && $item->product->product->images->isNotEmpty()) {
                            $image = url('images/product/' . $item->product->product->images->first()->image_url);
                        } elseif ($item->image) {
                            $image = url('images/product/' . $item->image_url);
                        }
                        return [
                            'name' => $item->product_name,
                            'quantity' => (int) $item->quantity,
                            'price' => (float) $item->price,
                            'image' => $image,
                        ];
                    })->toArray(),
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                ];
            });

            return response()->json([
                'status' => true,
                'data' => $formattedOrders,
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'total' => $orders->total(),
                ],
            ]);
        } catch (\Exception $e) {
            Logger::error('Lỗi trong getOrders', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id() ?? null,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lấy đơn hàng.'
            ], 500);
        }
    }

    public function cancelOrder(Request $request, $orderId)
    {
        try {
            // Validate orderId
            if (!is_numeric($orderId) || $orderId <= 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'ID đơn hàng không hợp lệ.'
                ], 400);
            }

            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng hoặc chưa đăng nhập.'
                ], 401);
            }

            // Tìm đơn hàng
            $order = Order::where('id', $orderId)
                ->where('user_id', $user->id)
                ->first();

            if (!$order) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy đơn hàng.'
                ], 404);
            }

            // Kiểm tra trạng thái đơn hàng
            if ($order->status !== OrderStatus::PROCESSING) {
                return response()->json([
                    'status' => false,
                    'message' => 'Chỉ có thể hủy đơn hàng đang xử lý.'
                ], 422);
            }

            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
            DB::transaction(function () use ($order, $user) {
                // Cập nhật trạng thái đơn hàng
                $order->status = OrderStatus::CANCELLED;
                $order->save();

                // Ghi log hành động
                Log::create([
                    'user_id' => $user->id,
                    'action' => 'update',
                    'table_name' => 'orders',
                    'record_id' => $order->id,
                    'description' => 'Hủy đơn hàng thành công',
                ]);

                // Optional: Khôi phục số lượng tồn kho (nếu cần)
                foreach ($order->orderItems as $item) {
                    if ($item->product && $item->product->productStore) {
                        $item->product->productStore->increment('qty', $item->quantity);
                    } else {
                        Log::warning('Không thể khôi phục tồn kho cho OrderItem', [
                            'order_id' => $order->id,
                            'order_item_id' => $item->id,
                            'product_detail_id' => $item->product_id ?? null,
                        ]);
                    }
                }
            });

            return response()->json([
                'status' => true,
                'message' => 'Hủy đơn hàng thành công!'
            ]);
        } catch (\Exception $e) {
            Logger::error('Lỗi khi hủy đơn hàng', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id() ?? null,
                'order_id' => $orderId,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi hủy đơn hàng.'
            ], 500);
        }
    }


    public function handleGoogleCallback(Request $request)
    {
        $client = new GoogleClient(['client_id' => env('GOOGLE_CLIENT_ID')]);

        try {
            // Kiểm tra credential
            if (!$request->has('credential') || empty($request->credential)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Thiếu hoặc không hợp lệ credential'
                ], 400);
            }

            // Xác minh token
            $payload = $client->verifyIdToken($request->credential);
            if (!$payload) {
                return response()->json([
                    'status' => false,
                    'message' => 'Token Google không hợp lệ'
                ], 401);
            }

            // Xử lý user và tạo token
            $user = User::firstOrCreate(
                ['email' => $payload['email']],
                [
                    'name' => $payload['name'],
                    'password' => Hash::make(Str::random(24)),
                    'created_by' => 1,
                    'status' => 1
                ]
            );

            // Kiểm tra status
            if ($user->status !== 1) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tài khoản của bạn đã bị khóa hoặc không hoạt động!'
                ], 403);
            }

            return response()->json([
                'status' => true,
                'token' => $user->createToken('google-token')->plainTextToken,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Logger::error('Google login error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi khi đăng nhập bằng Google'
            ], 500);
        }
    }
}
