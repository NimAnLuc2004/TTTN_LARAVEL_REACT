<?php

namespace App\Http\Controllers;

use App\Models\ProductDetail;
use Illuminate\Http\Request;
use App\Models\Log;
use Illuminate\Support\Facades\Auth;

class ProductDetailController extends Controller
{
    private function writeLog($action, $table, $recordId, $description)
    {
        Log::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'table_name' => $table,
            'record_id' => $recordId,
            'description' => $description,
        ]);
    }
    public function index()
    {
        $prodetail = ProductDetail::query()
            ->join('products', 'products.id', '=', 'product_details.product_id')
            ->select("product_details.id", "product_details.product_id", "products.name as product_name", "product_details.color", "product_details.size", "product_details.stock", "product_details.price")
            ->paginate(10);
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
        $idLog = $prodetail->id;
        $Data = $prodetail->toJson();
        if ($prodetail->delete()) {
            $this->writeLog('destroy', 'product_details', $idLog, 'Xóa chi tiết sản phẩm' . $Data);
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
        $prodetail->created_by = Auth::id();
        $prodetail->created_at = now();
        if ($prodetail->save()) {
            $this->writeLog('create', 'product_details', $prodetail->id, 'Thêm chi tiết sản phẩm');
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
        $prodetail->product_id =  $request->product_id;
        $prodetail->color =  $request->color;
        $prodetail->size =  $request->size;
        $prodetail->stock =  $request->stock;
        $prodetail->price =  $request->price;
        $prodetail->updated_by = Auth::id();
        $prodetail->updated_at = now();
        if ($prodetail->save()) {
            $this->writeLog('update', 'product_details', $prodetail, 'Cập nhật chi tiết sản phẩm'.$prodetail->toJson());
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật thành công',
                'prodetail' => $prodetail
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thể cập nhật',
                'prodetail' => null
            ]);
        }
    }
}
