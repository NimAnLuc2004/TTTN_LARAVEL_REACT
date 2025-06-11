<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Log;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;


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
    public function index(Request $request)
    {
        $query = User::where('status', '!=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "name", "image", "status", "role");

        if ($request->has('page')) {
            $users = $query->paginate(10);
        } else {
            $users = $query->get();
        }
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'users' => $users
        ];
        return response()->json($result);
    }
    public function trash()
    {
        $users = User::where('status', '=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "name", "image", "status", "role")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'users' => $users
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'user' => null,
                'shipping_address' => null
            ]);
        }


        $shippingAddress = ShippingAddress::where('user_id', $id)->first();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'user' => $user,
            'shipping_address' => $shippingAddress
        ]);
    }


    public function store(StoreUserRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password); // Mã hóa mật khẩu
            $user->role = $request->role;
            $user->status = $request->status;
            $user->created_by = Auth::id();
            $user->created_at = now();

            // Xử lý ảnh đại diện
            $images = [];

            if ($request->hasFile('image')) {
                foreach ($request->file('image') as $image) {
                    if (in_array($image->extension(), ['jpg', 'jpeg', 'png', 'webp'])) {
                        $imageName = time() . '_' . uniqid() . '.' . $image->extension();
                        $image->move(public_path('images/user'), $imageName);
                        $images[] = $imageName;
                    }
                }
                $user->image = $images; // Lưu trực tiếp mảng vào cột json
            }

            if ($user->save()) {
                $this->writeLog('create', 'users', $user->id, 'Thêm người dùng mới');

                // Lưu địa chỉ giao hàng
                $address = new ShippingAddress();
                $address->user_id = $user->id;
                $address->address = $request->address;
                $address->phone = $request->phone;
                $address->created_at = now();
                $address->created_by = Auth::id();

                if ($address->save()) {
                    DB::commit();
                    $this->writeLog(
                        'create',
                        'users,address',
                        $user->id,
                        'Thêm người dùng mới - User ID: ' . $user->id . ', Address ID: ' . $address->id
                    );
                    return response()->json([
                        'status' => true,
                        'message' => 'Thêm người dùng thành công!',
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'role' => $user->role,
                            'status' => $user->status,
                            'phone' => $address->phone ?? '',
                            'address' => $address->address ?? '',
                            'image' => $images // Trả về mảng
                        ]
                    ]);
                } else {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'message' => 'Lưu địa chỉ giao hàng thất bại!',
                        'user' => $user
                    ]);
                }
            }

            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Không thể thêm người dùng!',
                'user' => null
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage(),
                'user' => null
            ]);
        }
    }
    public function update(UpdateUserRequest $request, $id)
    {
        DB::beginTransaction(); // Bắt đầu transaction

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Người dùng không tồn tại!',
                ]);
            }

            // Kiểm tra nếu đang chỉnh sửa tài khoản đang đăng nhập
            $isCurrentUser = ($id == Auth::id());
            $user->name = $request->name;
            $user->email = $request->email;

            // Kiểm tra nếu có cập nhật mật khẩu thì mới mã hóa lại
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->role = $request->role;
            $user->status = $request->status;
            $user->updated_by = Auth::id();
            $user->updated_at = now();

            // Cập nhật ảnh đại diện
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
            }

            // Lưu thông tin người dùng
            $user->save();

            // Cập nhật địa chỉ giao hàng
            $address = ShippingAddress::where('user_id', $user->id)->first();
            if (!$address) {
                $address = new ShippingAddress();
                $address->user_id = $user->id;
            }

            $address->address = $request->address;
            $address->phone = $request->phone;
            $address->updated_at = now();
            $address->updated_by = Auth::id();

            if (!$address->save()) {
                DB::rollBack(); // Rollback nếu lưu địa chỉ thất bại
                return response()->json([
                    'status' => false,
                    'message' => 'Lưu địa chỉ giao hàng thất bại!',
                    'user' => $user
                ]);
            }

            // Commit transaction nếu tất cả các thao tác thành công
            DB::commit();

            // Ghi log và trả kết quả
            $this->writeLog(
                'update',
                'users,address',
                $user->id,
                'Cập nhật người dùng - User ID: ' . $user->toJson() . ', Address ID: ' . $address->toJson()
            );

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật người dùng thành công!' . ($isCurrentUser ? ' Vui lòng đăng nhập lại.' : ''),
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'phone' => $address->phone ?? '',
                    'address' => $address->address ?? '',
                    'image' => $images // Trả về mảng
                ],
                'require_logout' => $isCurrentUser 
            ]);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback nếu có lỗi
            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage(),
                'user' => null
            ]);
        }
    }


    public function status($id)
    {
        if ($id == Auth::id()) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể thay đổi trạng thái tài khoản đang đăng nhập',
                'user' => null
            ]);
        }
        $user = User::find($id);
        if ($user == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'user' => null
            ];
            return response()->json($result);
        }
        $user->status = ($user->status == 1) ? 2 : 1;
        $user->updated_by =  Auth::id();
        $user->updated_at =  date('Y-m-d H:i:s');
        if ($user->save()) {
            $this->writeLog('status', 'users', $user->id, 'Thay đổi trạng thái người dùng');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'user' => $user
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'user' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        if ($id == Auth::id()) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể xóa tài khoản đang đăng nhập',
                'user' => null
            ]);
        }
        $user = User::find($id);
        if ($user == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'user' => null
            ];
            return response()->json($result);
        }
        $user->status = 0;
        $user->updated_by =  Auth::id();
        $user->updated_at =  date('Y-m-d H:i:s');
        if ($user->save()) {
            $this->writeLog('delete', 'users', $user->id, 'Chuyển người dùng vào thùng rác');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'user' => $user
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'user' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $user = User::find($id);
        if ($user == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'user' => null
            ];
            return response()->json($result);
        }
        $user->status = 2;
        $user->updated_by =  Auth::id();
        $user->updated_at =  date('Y-m-d H:i:s');
        if ($user->save()) {
            $this->writeLog('restore', 'users', $user->id, 'Khôi phục người dùng ');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'user' => $user
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'user' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        if ($id == Auth::id()) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể xóa tài khoản đang đăng nhập',
                'user' => null
            ]);
        }
        $user = User::find($id);
        if ($user == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'user' => null
            ];
            return response()->json($result);
        }
        $idLog = $user->id;
        $Data = $user->toJson();
        if ($user->delete()) {
            $this->writeLog('destroy', 'users', $idLog, 'Xóa vĩnh viễn người dùng: ' . $Data);
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'user' => $user
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'user' => null
            ];
        }
        return response()->json($result);
    }
    public function login(Request $request)
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

    public function totalUser()
    {
        $total_user = User::where('role', 'user')
            ->where('status', 1)
            ->count();


        return response()->json([
            'status' => true,
            'message' => 'Tổng số khách hàng',
            'total_user' => $total_user
        ]);
    }
    public function profile()
    {
        $userdata = auth()->user();
        return response()->json([
            "status" => true,
            "message" => "Profile data",
            "data" => $userdata,
            "id" => auth()->user()->id
        ]);
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
