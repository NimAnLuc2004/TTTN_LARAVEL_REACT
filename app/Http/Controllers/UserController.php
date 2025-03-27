<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('status', '!=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "name", "phone", "password", "thumbnail", "status", "role")
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
            ->select("id", "name", "phone", "thumbnail", "status", "role")
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
        if ($user == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'user' => $user
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'user' => $user
            ];
        }
        return response()->json($result);
    }
    public function store(StoreUserRequest $request)
    {
        $user = new User();
        $user->name =  $request->name;
        $user->email =  $request->email;

        $thumbnails = []; // Khởi tạo mảng cho thumbnail

        if ($request->hasFile('thumbnail')) {
            foreach ($request->file('thumbnail') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') . '_' . uniqid() . '.' . $exten; // Đổi tên ảnh để tránh trùng lặp
                $image->move(public_path('thumbnail/user'), $imageName);
                $thumbnails[] = $imageName;
            }
            $user->image = json_encode($thumbnails);
        } else {
            return response()->json(['status' => false, 'message' => 'Không có hình ảnh nào được tải lên.']);
        }
        $user->role     =  $request->role;
        $user->password =  $request->password;
        $user->created_at =  date('Y-m-d H:i:s');
        $user->status =  $request->status;
        if ($user->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'user' => $user
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'user' => null
            ];
        }
        return response()->json($result);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::find($id);
        if ($user == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tín',
                'user' => null
            ];
            return response()->json($result);
        }
        $user->name =  $request->name;
        $user->email =  $request->email;

        // Xử lý thumbnail
        $thumbnails = []; // Khởi tạo mảng cho thumbnail

        // Nếu có hình ảnh mới
        if ($request->hasFile('thumbnail')) {
            // Xóa hình ảnh cũ nếu có
            if ($user->image) {
                $oldThumbnails = json_decode($user->image);
                foreach ($oldThumbnails as $oldThumbnail) {
                    $oldThumbnailPath = public_path('thumbnail/user/' . $oldThumbnail);
                    if (file_exists($oldThumbnailPath)) {
                        unlink($oldThumbnailPath); // Xóa file cũ
                    }
                }
            }

            // Xử lý hình ảnh mới
            foreach ($request->file('thumbnail') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') . '_' . uniqid() . '.' . $exten; // Đổi tên ảnh để tránh trùng lặp
                $image->move(public_path('thumbnail/user'), $imageName);
                $thumbnails[] = $imageName;
            }

            // Cập nhật thumbnail mới
            $user->image = json_encode($thumbnails);
        } else {
            // Nếu không có hình ảnh mới, giữ nguyên hình ảnh cũ
            $user->image = $user->image;
        }

        $user->role     =  $request->role;
        if ($request->password == null) {
            $user->password =  $user->password;
        } else {
            $user->password =  $request->password;
        }


        $user->updated_at =  date('Y-m-d H:i:s');
        $user->status =  $request->status;
        if ($user->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'user' => $user
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'user' => null
            ];
        }
        return response()->json($result);
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
