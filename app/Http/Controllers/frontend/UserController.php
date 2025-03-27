<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function loginuser(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        $loginuser = User::where('email', $email)->first();

        if ($loginuser && Hash::check($password, $loginuser->password)) {
     
            $result = [
                'status' => true,
                'message' => 'Đăng nhập thành công',
                'user' => $loginuser,
            ];
        } else {
            // Nếu email hoặc mật khẩu sai
            $result = [
                'status' => false,
                'message' => 'Email hoặc mật khẩu không chính xác',
            ];
        }

        return response()->json($result);
    }
    public function customer_register(Request $request)
    {
  
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Email đã tồn tại.',
            ]);
        }
    
        $user = new User();
        $user->name =  $request->name;
        $user->email =  $request->email;
        $user->phone =  $request->phone;
        $user->address =  $request->address;
        $user->gender =  $request->gender;
        $thumbnails = [];
    
        if ($request->hasFile('thumbnail')) {
            foreach ($request->file('thumbnail') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') . '_' . uniqid() . '.' . $exten;
                $image->move(public_path('thumbnail/user'), $imageName);
                $thumbnails[] = $imageName;
            }
            $user->thumbnail = json_encode($thumbnails);
        } else {
            return response()->json(['status' => false, 'message' => 'Không có hình ảnh nào được tải lên.']);
        }
    
        $user->roles = "customer";
        $user->fullname = $request->fullname;
        $user->password = $request->password; 
        $user->created_by = 1;
        $user->created_at = date('Y-m-d H:i:s');
        $user->status = 1;
    
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
}
