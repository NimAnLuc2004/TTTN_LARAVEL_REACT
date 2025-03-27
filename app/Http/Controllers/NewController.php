<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewController extends Controller
{
    public function index()
    {
        $new = News::where('status', '!=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "title")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'new' => $new
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'new' => $new
            ];
        }
        return response()->json($result);
    }
    public function status($id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        $new->status = ($new->status == 1) ? 2 : 1;
        $new->updated_at =  date('Y-m-d H:i:s');
        if ($new->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'new' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        $new->status = 0;
        $new->updated_at =  date('Y-m-d H:i:s');
        if ($new->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'new' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        $new->status = 2;
        $new->updated_at =  date('Y-m-d H:i:s');
        if ($new->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'new' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        if ($new->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'new' => null
            ];
        }
        return response()->json($result);
    }
    public function trash()
    {
        $new = News::where('status', '=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "title")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'new' => $new
        ];
        return response()->json($result);
    }
    public function store(Request $request)
    {

        $new = new News();
        $new->title =  $request->title;
        $new->content =  $request->content;
        $new->created_at =  date('Y-m-d H:i:s');
        if ($new->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'new' => null
            ];
        }
        return response()->json($result);
    }
    public function update(Request $request, $id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        $new->title =  $request->title;
        $new->content =  $request->content;
        $new->updated_at =  date('Y-m-d H:i:s');
        if ($new->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'new' => null
            ];
        }
        return response()->json($result);
    }
}
