<?php

namespace App\Http\Controllers;

use App\Models\ProductDetail;
use Illuminate\Http\Request;

class ProductDetailController extends Controller
{
    public function index()
    {
        $prodetail = ProductDetail::query()
            ->select("id", "product_id", "color", "size","stock","price")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'prodetail' => $prodetail
        ];
        return response()->json($result);
    }
    public function destroy($id)
    {
        $prodetail = ProductDetail::find($id);
        if ($prodetail == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'prodetail' => null
            ];
            return response()->json($result);
        }
        if ($prodetail->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'prodetail' => $prodetail
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'prodetail' => null
            ];
        }
        return response()->json($result);
    }
    public function store(Request $request)
    {

        $prodetail = new ProductDetail();
        $prodetail->title =  $request->title;
        $prodetail->content =  $request->content;
        $prodetail->created_at =  date('Y-m-d H:i:s');
        if ($prodetail->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'prodetail' => $prodetail
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'prodetail' => null
            ];
        }
        return response()->json($result);
    }
    public function update(Request $request, $id)
    {
        $prodetail = ProductDetail::find($id);
        if ($prodetail == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'prodetail' => null
            ];
            return response()->json($result);
        }
        $prodetail->title =  $request->title;
        $prodetail->content =  $request->content;
        $prodetail->updated_at =  date('Y-m-d H:i:s');
        if ($prodetail->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'prodetail' => $prodetail
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'prodetail' => null
            ];
        }
        return response()->json($result);
    }
}
