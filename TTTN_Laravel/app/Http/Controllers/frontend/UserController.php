<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Log;
use App\Models\Order;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log as Logger;
use Google\Client as GoogleClient;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OrderStatus
{
    const PROCESSING = 'pending';
    const CANCELLED = 'cancelled';
}

class UserController extends Controller
{
    private function writeLog($action, $table, $recordId, $description)
    {
        Log::create([
            'user_id' =>  Auth::id(),
            'action' => $action,
            'table_name' => $table,
            'record_id' => $recordId,
            'description' => $description,
        ]);
    }
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
        DB::beginTransaction(); // Bắt đầu transaction
        try {
            // Xác thực đầu vào
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
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

            // Kiểm tra xem email có tồn tại trong hệ thống không
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email đã tồn tại.'
                ], 422);
            }

            // Tạo mới người dùng
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->role = 'user';
            $user->status = 1;
            $user->created_by = Auth::id() ?? 1; // Nếu không có Auth, mặc định là 1
            $user->created_at = now();

            $images = [];

            // Kiểm tra và xử lý ảnh đại diện nếu có
            if ($request->hasFile('image')) {
                foreach ($request->file('image') as $image) {
                    if (in_array($image->extension(), ['jpg', 'jpeg', 'png', 'webp'])) {
                        $imageName = time() . '_' . uniqid() . '.' . $image->extension();
                        $image->move(public_path('images/user'), $imageName);
                        $images[] = $imageName;
                    }
                }
                $user->image = $images; // Lưu trực tiếp mảng vào cột image
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Vui lòng tải lên ít nhất một hình ảnh.'
                ], 422);
            }

            // Lưu thông tin người dùng
            if (!$user->save()) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể đăng ký người dùng.'
                ], 500);
            }

            // Thêm địa chỉ giao hàng cho người dùng mới tạo
            $address = new ShippingAddress();
            $address->user_id = $user->id;
            $address->address = $request->address ?? '';
            $address->phone = $request->phone ?? '';
            $address->created_by = Auth::id() ?? 1;
            $address->created_at = now();

            if (!$address->save()) {
                // Nếu lưu địa chỉ thất bại, xóa người dùng đã tạo
                $user->delete();
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể lưu địa chỉ giao hàng. Người dùng đã bị xóa!'
                ], 500);
            }

            // Tạo 3 bản ghi chat với user2_id = 1, 2, 3
            $chatRecords = [];
            $targetUserIds = [1, 2, 3]; // Các user2_id cần tạo chat
            $userId = $user->id; // Lấy ID của user để sử dụng trong closure
            foreach ($targetUserIds as $user2_id) {
                // Kiểm tra xem user2_id có tồn tại không
                if (!User::where('id', $user2_id)->exists()) {
                    Logger::warning("Không thể tạo chat: User với ID $user2_id không tồn tại.");
                    continue; // Bỏ qua nếu user2_id không tồn tại
                }

                // Kiểm tra xem chat đã tồn tại chưa
                $existingChat = Chat::where(function ($query) use ($userId, $user2_id) {
                    $query->where('user1_id', $userId)->where('user2_id', $user2_id);
                })->orWhere(function ($query) use ($userId, $user2_id) {
                    $query->where('user1_id', $user2_id)->where('user2_id', $userId);
                })->first();

                if (!$existingChat) {
                    // Tạo mới chat
                    $chat = new Chat();
                    $chat->user1_id = $userId;
                    $chat->user2_id = $user2_id;

                    if ($chat->save()) {
                        $chatRecords[] = $chat;
                        Log::create([
                            'user_id' => $userId,
                            'action' => 'create',
                            'table_name' => 'chats',
                            'record_id' => $chat->id,
                            'description' => "Tạo chat giữa user {$userId} và user {$user2_id} khi đăng ký.",
                        ]);
                    } else {
                        Log::error("Không thể tạo chat giữa user {$userId} và user {$user2_id}.");
                    }
                }
            }

            // Ghi log hành động đăng ký
            Log::create([
                'user_id' => $userId,
                'action' => 'create',
                'table_name' => 'users',
                'record_id' => $userId,
                'description' => 'Đăng ký người dùng và địa chỉ giao hàng thành công',
            ]);

            // Commit transaction nếu tất cả thành công
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Đăng ký và thêm địa chỉ thành công!' . (count($chatRecords) > 0 ? ' Đã tạo ' . count($chatRecords) . ' cuộc trò chuyện.' : ''),
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $request->phone ?? '',
                    'address' => $request->address ?? '',
                    'image' => $images
                ],
                'address' => $address,
                'chats' => $chatRecords
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
    public function forgotPassword(Request $request)
    {
        // Xác thực đầu vào
        $request->validate([
            'email' => 'required|email'
        ]);

        // Tìm user theo email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Email không tồn tại trong hệ thống.'
            ], 404);
        }

        // Kiểm tra trạng thái tài khoản
        if ($user->status !== 1) {
            return response()->json([
                'status' => false,
                'message' => 'Tài khoản của bạn đã bị khóa hoặc không hoạt động!'
            ], 403);
        }

        try {
            // Tạo token đặt lại mật khẩu
            $token = Str::random(60);

            // Lưu token vào bảng password_resets
            DB::table('password_resets')->updateOrInsert(
                ['email' => $request->email],
                [
                    'token' => Hash::make($token),
                    'created_at' => Carbon::now()
                ]
            );

            // Tạo URL đặt lại mật khẩu
            $resetUrl = env('FRONTEND_URL', 'https://zstore.click') . '/reset-password?token=' . $token . '&email=' . urlencode($request->email);

            // Gửi email
            Mail::send('emails.reset_password', ['resetUrl' => $resetUrl, 'user' => $user], function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Yêu cầu đặt lại mật khẩu');
            });

            // Ghi log hành động
            Log::create([
                'user_id' => $user->id,
                'action' => 'request_password_reset',
                'table_name' => 'password_resets',
                'record_id' => $user->id,
                'description' => 'Yêu cầu đặt lại mật khẩu cho email ' . $request->email,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Email đặt lại mật khẩu đã được gửi!'
            ]);
        } catch (\Exception $e) {
            Logger::error('Lỗi gửi email đặt lại mật khẩu: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.'
            ], 500);
        }
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $reset = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$reset || !Hash::check($request->token, $reset->token)) {
            return response()->json([
                'status' => false,
                'message' => 'Token hoặc email không hợp lệ.'
            ], 400);
        }

        // Kiểm tra token có hết hạn không (60 phút)
        if (Carbon::parse($reset->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json([
                'status' => false,
                'message' => 'Token đã hết hạn. Vui lòng yêu cầu lại.'
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Email không tồn tại.'
            ], 404);
        }

        try {
            // Cập nhật mật khẩu
            $user->password = Hash::make($request->password);
            $user->save();

            // Xóa token sau khi sử dụng
            DB::table('password_resets')->where('email', $request->email)->delete();

            // Ghi log
            Log::create([
                'user_id' => $user->id,
                'action' => 'reset_password',
                'table_name' => 'users',
                'record_id' => $user->id,
                'description' => 'Đặt lại mật khẩu thành công cho email ' . $request->email,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Đặt lại mật khẩu thành công!'
            ]);
        } catch (\Exception $e) {
            Logger::error('Lỗi đặt lại mật khẩu: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra. Vui lòng thử lại.'
            ], 500);
        }
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
                        Logger::warning('Không thể khôi phục tồn kho cho OrderItem', [
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

        DB::beginTransaction(); // Bắt đầu transaction
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

            $chatRecords = [];
            // Nếu người dùng mới được tạo (đăng nhập lần đầu)
            if ($user->wasRecentlyCreated) {
                // Tạo 3 bản ghi chat với user2_id = 1, 2, 3
                $targetUserIds = [1, 2, 3];
                $userId = $user->id;
                foreach ($targetUserIds as $user2_id) {
                    // Kiểm tra xem user2_id có tồn tại không
                    if (!User::where('id', $user2_id)->exists()) {
                        Logger::warning("Không thể tạo chat: User với ID $user2_id không tồn tại.");
                        continue; // Bỏ qua nếu user2_id không tồn tại
                    }

                    // Kiểm tra xem chat đã tồn tại chưa
                    $existingChat = Chat::where(function ($query) use ($userId, $user2_id) {
                        $query->where('user1_id', $userId)->where('user2_id', $user2_id);
                    })->orWhere(function ($query) use ($userId, $user2_id) {
                        $query->where('user1_id', $user2_id)->where('user2_id', $userId);
                    })->first();

                    if (!$existingChat) {
                        // Tạo mới chat
                        $chat = new Chat();
                        $chat->user1_id = $userId;
                        $chat->user2_id = $user2_id;

                        if ($chat->save()) {
                            $chatRecords[] = $chat;
                            Log::create([
                                'user_id' => $userId,
                                'action' => 'create',
                                'table_name' => 'chats',
                                'record_id' => $chat->id,
                                'description' => "Tạo chat giữa user {$userId} và user {$user2_id} khi đăng nhập Google lần đầu.",
                            ]);
                        } else {
                            Log::error("Không thể tạo chat giữa user {$userId} và user {$user2_id}.");
                        }
                    }
                }

                // Ghi log hành động tạo người dùng
                Log::create([
                    'user_id' => $userId,
                    'action' => 'create',
                    'table_name' => 'users',
                    'record_id' => $userId,
                    'description' => 'Tạo người dùng qua đăng nhập Google lần đầu',
                ]);
            }

            // Commit transaction
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Đăng nhập bằng Google thành công!' . ($user->wasRecentlyCreated && count($chatRecords) > 0 ? ' Đã tạo ' . count($chatRecords) . ' cuộc trò chuyện.' : ''),
                'token' => $user->createToken('google-token')->plainTextToken,
                'user' => $user,
                'chats' => $chatRecords // Trả về các bản ghi chat (nếu có)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Logger::error('Google login error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi khi đăng nhập bằng Google: ' . $e->getMessage()
            ], 500);
        }
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $this->writeLog('logout', 'users', Auth::id(), 'Đăng xuất thành công');

        return response()->json([
            "status" => true,
            "message" => "User logged out"
        ]);
    }
}
