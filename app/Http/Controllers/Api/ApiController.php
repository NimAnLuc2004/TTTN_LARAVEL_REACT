<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);
        //user check email
        $user = User::where('email', $request->email)->first();
        //password check
        if (!empty($user)) {
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken("myToken")->plainTextToken;
                return response()->json([
                    "status" => true,
                    "message" => "Logged in successfully",
                    "token" => $token
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Password didn't match"

                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Email is invalid"

            ]);
        }
    }
    public function profile() {
        $userdata=auth()->user();
        return response()->json([
              "status" => true,
                "message" => "Profile data",
                "data"=>$userdata
        ]);
    }
    public function logout() {}
}
