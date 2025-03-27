<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index()
    {
        $page = Page::where('status', '!=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "title")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'page' => $page
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $page = Page::find($id);
        if ($page == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'page' => $page
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'page' => $page
            ];
        }
        return response()->json($result);
    }
    public function status($id)
    {
        $page = Page::find($id);
        if ($page == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'page' => null
            ];
            return response()->json($result);
        }
        $page->status = ($page->status == 1) ? 2 : 1;
        $page->updated_at =  date('Y-m-d H:i:s');
        if ($page->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'page' => $page
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'page' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $page = Page::find($id);
        if ($page == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'page' => null
            ];
            return response()->json($result);
        }
        $page->status = 0;
        $page->updated_at =  date('Y-m-d H:i:s');
        if ($page->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'page' => $page
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'page' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $page = Page::find($id);
        if ($page == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'page' => null
            ];
            return response()->json($result);
        }
        $page->status = 2;
        $page->updated_at =  date('Y-m-d H:i:s');
        if ($page->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'page' => $page
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'page' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $page = Page::find($id);
        if ($page == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'page' => null
            ];
            return response()->json($result);
        }
        if ($page->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'page' => $page
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'page' => null
            ];
        }
        return response()->json($result);
    }
    public function trash()
    {
        $page = Page::where('status', '=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "title")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'page' => $page
        ];
        return response()->json($result);
    }
    public function store(Request $request)
    {

        $page = new Page();
        $page->title =  $request->title;
        $page->content =  $request->content;
        $page->created_at =  date('Y-m-d H:i:s');
        if ($page->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'page' => $page
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'page' => null
            ];
        }
        return response()->json($result);
    }
    public function update(Request $request, $id)
    {
        $page = Page::find($id);
        if ($page == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'page' => null
            ];
            return response()->json($result);
        }
        $page->title =  $request->title;
        $page->content =  $request->content;
        $page->updated_at =  date('Y-m-d H:i:s');
        if ($page->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'page' => $page
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'page' => null
            ];
        }
        return response()->json($result);
    }
}
