<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use App\Models\ProductSale;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
        DB::beginTransaction(); // Bắt đầu transaction
        try {
            // Xác thực đầu vào
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'discount_percent' => 'required|numeric|min:0|max:100',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'productsale' => null
                ], 422);
            }

            // Kiểm tra sản phẩm tồn tại
            $product = Product::find($request->product_id);
            if ($product == null) {
                return response()->json([
                    'status' => false,
                    'message' => 'Mã sản phẩm không hợp lệ',
                    'productsale' => null
                ], 404);
            }

            // Kiểm tra xem product_id đã tồn tại trong Productsale chưa
            $productsale = Productsale::where('product_id', $request->product_id)->first();
            $isUpdate = false;

            if ($productsale) {
                // Cập nhật bản ghi hiện có
                $productsale->discount_percent = $request->discount_percent;
                $productsale->start_date = $request->start_date;
                $productsale->end_date = $request->end_date;
                $productsale->updated_by = Auth::id() ?? 1; // Nếu không có Auth, mặc định là 1
                $productsale->updated_at = now();
                $message = 'Cập nhật thành công';
                $isUpdate = true;
            } else {
                // Tạo mới bản ghi
                $productsale = new Productsale();
                $productsale->product_id = $request->product_id;
                $productsale->discount_percent = $request->discount_percent;
                $productsale->start_date = $request->start_date;
                $productsale->end_date = $request->end_date;
                $productsale->created_by = Auth::id() ?? 1;
                $productsale->created_at = now();
                $message = 'Thêm thành công';
            }

            // Lưu bản ghi
            if ($productsale->save()) {
                $action = $isUpdate ? 'update' : 'create';
                $this->writeLog($action, 'productsales', $productsale->id, $isUpdate ? 'Cập nhật sản phẩm giảm giá' : 'Thêm sản phẩm giảm giá');
                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => $message,
                    'productsale' => $productsale
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể ' . ($isUpdate ? 'cập nhật' : 'thêm') . ' sản phẩm giảm giá',
                    'productsale' => null
                ], 500);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
                'productsale' => null
            ], 500);
        }
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
            $this->writeLog('update', 'productsales', $productsale->id, 'Cập nhật sản phẩm giảm giá' . $productsale->toJson());
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
            $this->writeLog('destroy', 'productsales', $idLog, 'Xóa sản phẩm giảm giá' . $Data);
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
