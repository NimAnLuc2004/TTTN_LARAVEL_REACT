<?php

namespace App\Http\Controllers;

use App\Models\NewsCategory;
use Illuminate\Http\Request;

class NewCategoryController extends Controller
{
    public function index()
    {
        $newcats = NewsCategory::query()
            ->orderBy('created_at', 'ASC')
            ->select("id", "name")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'newcats' => $newcats
        ];
        return response()->json($result);
    }
    public function destroy($id)
    {
        $newcats = NewsCategory::find($id);
        if ($newcats == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'newcats' => null
            ];
            return response()->json($result);
        }
        if ($newcats->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'newcats' => $newcats
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'newcats' => null
            ];
        }
        return response()->json($result);
    }
}
