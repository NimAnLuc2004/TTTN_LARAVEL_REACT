<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductSale;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductSaleController extends Controller
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
        $productsale = Productsale::query()
            ->orderBy('created_at', 'DESC')
            ->select("id", "product_id", "discount_percent")
            ->paginate(10);
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'productsale' => $productsale
        ];
        return response()->json($result);
    }

    public function show($id)
    {
        $productsale = Productsale::find($id);
        if ($productsale == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'productsale' => $productsale
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'productsale' => $productsale
            ];
        }
        return response()->json($result);
    }
    public function store(Request $request)
    {
        $product = Product::find($request->product_id);

        if ($product == null) {
            $result = [
                'status' => false,
                'message' => 'Mã sản phẩm không hợp lệ',
                'productsale' => null
            ];
            return response()->json($result);
        }

        // Kiểm tra xem product_id đã tồn tại trong Productsale chưa
        $productsale = Productsale::where('product_id', $request->product_id)->first();

        if ($productsale) {
            $message = 'Đã có sản phẩm giảm giá';
        } else {
            $productsale = new Productsale();
            $productsale->product_id = $request->product_id;
            $productsale->discount_percent = $request->discount_percent;
            $productsale->start_date = $request->start_date;
            $productsale->end_date = $request->end_date;
            $productsale->created_by = Auth::id();
            $productsale->created_at = date('Y-m-d H:i:s');
            $message = 'Thêm thành công';
        }

        if ($productsale->save()) {
            $this->writeLog('create', 'productsales', $productsale->id, 'Thêm sản phẩm giảm giá');
            $result = [
                'status' => true,
                'message' => $message,
                'productsale' => $productsale
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm hoặc cập nhật',
                'productsale' => null
            ];
        }

        return response()->json($result);
    }

    public function update(Request $request, $id)
    {
        $productsale = Productsale::find($id);
        if ($productsale == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tín',
                'productsale' => null
            ];
            return response()->json($result);
        }
        $productsale->product_id =  $request->product_id;
        $productsale->discount_percent =  $request->discount_percent;
        $productsale->start_date =  $request->start_date;
        $productsale->end_date = $request->end_date;
        $productsale->updated_at =  date('Y-m-d H:i:s');
        $productsale->updated_by =  Auth::id();
        
        $productsale->end_date =  $request->end_date;
        if ($productsale->save()) {
            $this->writeLog('update', 'productsales', $productsale->id, 'Cập nhật sản phẩm giảm giá'. $productsale->toJson());
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'productsale' => $productsale
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'productsale' => null
            ];
        }
        return response()->json($result);
    }
    public function destroy($id)
    {
        $productsale = Productsale::find($id);
        if ($productsale == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'productsale' => null
            ];
            return response()->json($result);
        }
        $idLog = $productsale->id;
        $Data = $productsale->toJson();
        if ($productsale->delete()) {
            $this->writeLog('destroy', 'productsales', $idLog, 'Xóa sản phẩm giảm giá'.$Data);
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'productsale' => $productsale
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'productsale' => null
            ];
        }
        return response()->json($result);
    }
}
