<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Productstore;
use App\Http\Requests\StoreProductstoreRequest;
use App\Http\Requests\UpdateProductstoreRequest;
use App\Models\Product;

class ProductstoreController extends Controller
{
    public function index()
    {
        $productstore = Productstore::where('status', '!=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "product_id", "price_root", "status", "qty")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'productstore' => $productstore
        ];
        return response()->json($result);
    }
    public function trash()
    {
        $productstore = Productstore::where('status', '=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "product_id", "price_root", "status", "qty")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'productstore' => $productstore
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $productstore = Productstore::find($id);
        if ($productstore == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'productstore' => $productstore
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'productstore' => $productstore
            ];
        }
        return response()->json($result);
    }
    public function store(StoreProductstoreRequest $request)
    {
        $product = Product::find($request->product_id);

        if ($product == null) {
            $result = [
                'status' => false,
                'message' => 'Mã sản phẩm không hợp lệ',
                'productstore' => null
            ];
            return response()->json($result);
        }

        // Kiểm tra xem product_id đã tồn tại trong ProductStore chưa
        $productstore = ProductStore::where('product_id', $request->product_id)->first();

        if ($productstore) {
            // Nếu đã tồn tại, tăng qty lên
            $productstore->qty += $request->qty;
            $message = 'Cập nhật số lượng thành công';
        } else {
            // Nếu chưa tồn tại, tạo mới
            $productstore = new ProductStore();
            $productstore->product_id = $request->product_id;
            $productstore->qty = $request->qty;
            $productstore->price_root = $request->price_root;
            $productstore->created_by = 1;
            $productstore->created_at = date('Y-m-d H:i:s');
            $productstore->status = 1;
            $message = 'Thêm thành công';
        }

        if ($productstore->save()) {
            $result = [
                'status' => true,
                'message' => $message,
                'productstore' => $productstore
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm hoặc cập nhật',
                'productstore' => null
            ];
        }

        return response()->json($result);
    }

    public function update(UpdateProductstoreRequest $request, $id)
    {
        $productstore = Productstore::find($id);
        if ($productstore == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tín',
                'productstore' => null
            ];
            return response()->json($result);
        }
        $productstore->product_id =  $request->product_id;
        $productstore->price_root =  $request->price_root;
        $productstore->qty =  $request->qty;
        $productstore->updated_by =  1;
        $productstore->updated_at =  date('Y-m-d H:i:s');
        $productstore->status =  $request->status;
        if ($productstore->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'productstore' => $productstore
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'productstore' => null
            ];
        }
        return response()->json($result);
    }
    public function status($id)
    {
        $productstore = Productstore::find($id);
        if ($productstore == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'productstore' => null
            ];
            return response()->json($result);
        }
        $productstore->status = ($productstore->status == 1) ? 2 : 1;
        $productstore->updated_by =  1;
        $productstore->updated_at =  date('Y-m-d H:i:s');
        if ($productstore->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'productstore' => $productstore
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'productstore' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $productstore = Productstore::find($id);
        if ($productstore == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'productstore' => null
            ];
            return response()->json($result);
        }
        $productstore->status = 0;
        $productstore->updated_by =  1;
        $productstore->updated_at =  date('Y-m-d H:i:s');
        if ($productstore->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'productstore' => $productstore
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'productstore' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $productstore = Productstore::find($id);
        if ($productstore == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'productstore' => null
            ];
            return response()->json($result);
        }
        $productstore->status = 2;
        $productstore->updated_by =  1;
        $productstore->updated_at =  date('Y-m-d H:i:s');
        if ($productstore->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'productstore' => $productstore
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'productstore' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $productstore = Productstore::find($id);
        if ($productstore == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'productstore' => null
            ];
            return response()->json($result);
        }
        if ($productstore->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'productstore' => $productstore
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'productstore' => null
            ];
        }
        return response()->json($result);
    }
    public function totalProductsInStock()
    {
        $totalquantity = Productstore::sum('qty') ?? 0; 
        return response()->json([
            'status' => true,
            'message' => 'Số lượng sản phẩm hiện có trong kho',
            'total_quantity' => $totalquantity
        ]);
    }
    
}
