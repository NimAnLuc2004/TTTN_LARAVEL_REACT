<?php
//sửa nhiều

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\ProductCategory;
use App\Models\ProductImage;

use Illuminate\Support\Str;



class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('products.status', '!=', 0)
            ->join('product_category', 'products.id', '=', 'product_category.product_id')
            ->join('categories', 'product_category.category_id', '=', 'categories.id')
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->with('images')
            ->orderBy('products.created_at', 'DESC')
            ->select(
                "products.id",
                "categories.id as category_id",
                "products.name",
                "categories.name as catname",
                "brands.name as brandname",
                "products.status",
                "products.price"
            )
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products
        ]);
    }
    public function trash()
    {
        $products = Product::where('products.status', '=', 0)
            ->join('product_category', 'products.id', '=', 'product_category.product_id')
            ->join('categories', 'product_category.category_id', '=', 'categories.id')
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->with('images')
            ->orderBy('products.created_at', 'DESC')
            ->select(
                "products.id",
                "products.name",
                "categories.name as category_name",
                "brands.name as brand_name",
                "products.status",
                "products.price"
            )
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products
        ]);
    }

    public function show($id)
    {
        $product = Product::with('images')->find($id);
        if ($product == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'product' => $product
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'product' => $product
            ];
        }
        return response()->json($result);
    }
    public function store(StoreProductRequest $request)
    {
        $product = new Product();
        $product->brand_id = $request->brand_id;
        $product->name = $request->name;
        $product->price = $request->price;
        $product->description = $request->description;
        $product->created_at = now();
        $product->status = $request->status;

        if ($product->save()) {
            // 🟢 Giải mã JSON nếu `category_id` là chuỗi
            $categoryIds = is_string($request->category_id) 
                ? json_decode($request->category_id, true) 
                : $request->category_id;
    
            if (is_array($categoryIds)) {
                foreach ($categoryIds as $categoryId) {
                    $productCategory = new ProductCategory();
                    $productCategory->product_id = $product->id;
                    $productCategory->category_id = $categoryId;
                    $productCategory->save();                    
                }
            }
            // Xử lý hình ảnh
            if ($request->has('image_url')) {
                $count = 1;
                foreach ($request->image_url as $file) {
                    $productImage = new ProductImage();
                    $productImage->product_id = $product->id;
                    $exten = $file->extension();
                    $imageName = Str::of($request->name)->slug('-') . date('YmdHis') . $count . "." . $exten;
                    $file->move(public_path('images/product'), $imageName);
                    $productImage->image_url = $imageName;

                    if (!$productImage->save()) {
                        return response()->json([
                            'status' => false,
                            'message' => 'Lưu ảnh thất bại cho: ' . $imageName,
                        ], 500);
                    }

                    $count++;
                }
            }


            return response()->json([
                'status' => true,
                'message' => 'Thêm sản phẩm thành công',
                'product' => $product,
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thêm được sản phẩm',
                'product' => null,
            ]);
        }
    }
    public function update(UpdateProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $product->brand_id = $request->brand_id;
        $product->name = $request->name;
        $product->price = $request->price;
        $product->description = $request->description;
        $product->status = $request->status;
        $product->updated_at = now();
    
        if ($product->save()) {
            $categoryIds = is_string($request->category_id) 
                ? json_decode($request->category_id, true) 
                : (array) $request->category_id;
    
            if (is_array($categoryIds)) {
                ProductCategory::where('product_id', $product->id)->delete();
                foreach ($categoryIds as $categoryId) {
                    $productCategory = new ProductCategory();
                    $productCategory->product_id = $product->id;
                    $productCategory->category_id = $categoryId;
                    $productCategory->save();
                }
            }
    
            if ($request->has('image_url')) {
                $count = 1;
                foreach ($request->image_url as $file) {
                    $productImage = new ProductImage();
                    $productImage->product_id = $product->id;
                    $exten = $file->extension();
                    $imageName = Str::of($request->name)->slug('-') . date('YmdHis') . $count . "." . $exten;
                    $file->move(public_path('images/product'), $imageName);
                    $productImage->image_url = $imageName;
                    $productImage->save();
                    $count++;
                }
            }
    
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật sản phẩm thành công',
                'product' => $product,
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không cập nhật được sản phẩm',
                'errors' => $product->errors(), // Thêm chi tiết lỗi
            ], 422);
        }
    }


    public function status($id)
    {
        $product = Product::find($id);
        if ($product == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'product' => null
            ];
            return response()->json($result);
        }
        $product->status = ($product->status == 1) ? 2 : 1;

        $product->updated_at =  date('Y-m-d H:i:s');
        if ($product->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'product' => $product
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'product' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $product = Product::find($id);
        if ($product == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'product' => null
            ];
            return response()->json($result);
        }
        $product->status = 0;

        $product->updated_at =  date('Y-m-d H:i:s');
        if ($product->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'product' => $product
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'product' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $product = Product::find($id);
        if ($product == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'product' => null
            ];
            return response()->json($result);
        }
        $product->status = 2;

        $product->updated_at =  date('Y-m-d H:i:s');
        if ($product->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'product' => $product
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'product' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if ($product == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'product' => null
            ];
            return response()->json($result);
        }
        if ($product->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'product' => $product
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'product' => null
            ];
        }
        return response()->json($result);
    }
}
