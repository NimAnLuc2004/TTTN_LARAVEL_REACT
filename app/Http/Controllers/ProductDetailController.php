<?php

namespace App\Http\Controllers;

use App\Models\ProductDetail;
use Illuminate\Http\Request;

class ProductDetailController extends Controller
{
    public function index()
    {
        $prodetail = ProductDetail::query()
            ->join('products', 'products.id', '=', 'product_details.product_id')
            ->select("product_details.id", "product_details.product_id", "products.name as product_name", "product_details.color", "product_details.size", "product_details.stock", "product_details.price")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'prodetail' => $prodetail
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $productdetail = ProductDetail::find($id);
        if ($productdetail == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'prodetail' => $productdetail
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'prodetail' => $productdetail
            ];
        }
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
        $prodetail->product_id =  $request->product_id;
        $prodetail->color =  $request->color;
        $prodetail->size =  $request->size;
        $prodetail->stock =  $request->stock;
        $prodetail->price =  $request->price;
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
    
        // Tìm product detail
        $prodetail = ProductDetail::find($id);
        if (!$prodetail) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy thông tin sản phẩm',
                'prodetail' => null
            ]);
        }
    
        // Cập nhật dữ liệu
        $prodetail->update([
            'product_id' => $request->product_id,
            'color' => $request->color,
            'size' => $request->size,
            'stock' => $request->stock,
            'price' => $request->price,
            'updated_at' => now()
        ]);
    
        return response()->json([
            'status' => true,
            'message' => 'Cập nhật thành công',
            'prodetail' => $prodetail
        ]);
    }
    
}
