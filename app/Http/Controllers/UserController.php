<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('status', '!=', 0)
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
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password); // Mã hóa mật khẩu
        $user->role = $request->role;
        $user->status = $request->status;
        $user->created_by =  1;
        $user->created_at = now();

        $images = [];

        if ($request->hasFile('image')) {
            foreach ($request->file('image') as $image) {
                $imageName = time() . '_' . uniqid() . '.' . $image->extension();
                $image->move(public_path('images/user'), $imageName);
                $images[] = $imageName;
            }
            $user->image = json_encode($images);
        }

        if ($user->save()) {
            // Sau khi tạo user, lưu địa chỉ giao hàng
            $address = new ShippingAddress();
            $address->user_id = $user->id;
            $address->address = $request->address;
            $address->phone = $request->phone;
            $address->created_at = now();
            $address->created_by =  1;
            $address->save();

            return response()->json([
                'status' => true,
                'message' => 'Thêm người dùng thành công!',
                'user' => $user
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể thêm người dùng!',
            'user' => null
        ]);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Người dùng không tồn tại!',
            ]);
        }

        $user->name = $request->name;
        $user->email = $request->email;

        // Kiểm tra nếu có cập nhật mật khẩu thì mới mã hóa lại
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->role = $request->role;
        $user->status = $request->status;
        $user->updated_by =  1;
        $user->updated_at = now();

        // Cập nhật ảnh đại diện
        $images = [];

        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu có
            if ($user->image) {
                $oldImages = json_decode($user->image, true);
                foreach ($oldImages as $oldImage) {
                    $oldImagePath = public_path('images/user/' . $oldImage);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
            }

            // Lưu ảnh mới
            foreach ($request->file('image') as $image) {
                $imageName = time() . '_' . uniqid() . '.' . $image->extension();
                $image->move(public_path('images/user'), $imageName);
                $images[] = $imageName;
            }
            $user->image = json_encode($images);
        }

        if ($user->save()) {
            // Cập nhật địa chỉ giao hàng
            $address = ShippingAddress::where('user_id', $user->id)->first();
            if (!$address) {
                $address = new ShippingAddress();
                $address->user_id = $user->id;
            }

            $address->address = $request->address;
            $address->phone = $request->phone;
            $address->updated_at = now();
            $address->updated_by =  1;
            $address->save();

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật người dùng thành công!',
                'user' => $user
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể cập nhật người dùng!',
            'user' => null
        ]);
    }


    public function status($id)
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
        $user->status = ($user->status == 1) ? 2 : 1;
        $user->updated_by =  1;
        $user->updated_at =  date('Y-m-d H:i:s');
        if ($user->save()) {
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
        $user->updated_by =  1;
        $user->updated_at =  date('Y-m-d H:i:s');
        if ($user->save()) {
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
        $user->updated_by =  1;
        $user->updated_at =  date('Y-m-d H:i:s');
        if ($user->save()) {
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
        $user = User::find($id);
        if ($user == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'user' => null
            ];
            return response()->json($result);
        }
        if ($user->delete()) {
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
        $email = $request->input('email');
        $password = $request->input('password');

        // Tìm người dùng theo email
        $loginuser = User::where('email', $email)->first();

        // Kiểm tra nếu người dùng tồn tại, mật khẩu đúng và role là admin
        if ($loginuser && Hash::check($password, $loginuser->password) && $loginuser->role === 'admin') {
            $result = [
                'status' => true,
                'message' => 'Đăng nhập thành công',
                'user' => $loginuser,
            ];
        } else {
            // Nếu email, mật khẩu sai hoặc không phải là admin
            $result = [
                'status' => false,
                'message' => 'Email hoặc mật khẩu không chính xác hoặc tài khoản không có quyền truy cập',
            ];
        }

        return response()->json($result);
    }
    public function totalUser()
    {
        $total_user = User::where('role', 'user')->count();


        return response()->json([
            'status' => true,
            'message' => 'Tổng số khách hàng',
            'total_user' => $total_user
        ]);
    }
}
