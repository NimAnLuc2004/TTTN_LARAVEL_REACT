<?php

namespace App\Http\Controllers;


use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::where('status', '!=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "image", "status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'brands' => $brands
        ];
        return response()->json($result);
    }
    public function trash()
    {
        $brands = Brand::where('status', '=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "image", "status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'brands' => $brands
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $brand = Brand::find($id);
        if ($brand == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'brands' => $brand
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'brands' => $brand
            ];
        }
        return response()->json($result);
    }
    public function store(StoreBrandRequest $request)
    {
        $brands = [];
        $count=1;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') .$count. '.' . $exten;
                $image->move(public_path('images/brand'), $imageName);
                $brands[] = $imageName; // Lưu tên hình ảnh vào mảng
                $count++;
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Không có hình ảnh nào được tải lên.']);
        }

        $brand = new Brand();
        $brand->name =  $request->name;

        $brand->image = json_encode($brands);
        $brand->description =  $request->description;
        $brand->created_by =  1;
        // $brand->sort_order =  $request->sort_order;
        $brand->created_at =  date('Y-m-d H:i:s');
        $brand->status =  $request->status;
        if ($brand->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'brands' => $brand
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'brands' => null
            ];
        }
        return response()->json($result);
    }

    public function update(UpdateBrandRequest $request, $id)
    {
        $brand = Brand::find($id);
        if ($brand == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'brands' => null
            ];
            return response()->json($result);
        }
        $brand->name =  $request->name;

        $brands = [];
        $count=1;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') .$count. '.' . $exten;
                $image->move(public_path('images/brand'), $imageName);
                $brands[] = $imageName;
                $count++;
            }

            // Cập nhật hình ảnh mới nếu có
            $brand->image = json_encode($brands);
        } else {
    
            $brand->image = $brand->image; 
        }
        $brand->description =  $request->description;
        // $brand->sort_order =  $request->sort_order;
        $brand->updated_at =  date('Y-m-d H:i:s');
        $brand->status =  $request->status;
        $brand->updated_by =  1;
        if ($brand->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'brands' => $brand
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'brands' => null
            ];
        }
        return response()->json($result);
    }
    public function status($id)
    {
        $brand = Brand::find($id);
        if ($brand == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'brands' => null
            ];
            return response()->json($result);
        }
        $brand->status = ($brand->status == 1) ? 2 : 1;
        $brand->updated_at =  date('Y-m-d H:i:s');
        $brand->updated_by =  1;
        if ($brand->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'brands' => $brand
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'brands' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $brand = Brand::find($id);
        if ($brand == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'brands' => null
            ];
            return response()->json($result);
        }
        $brand->status = 0;
        $brand->updated_at =  date('Y-m-d H:i:s');
        $brand->updated_by =  1;
        if ($brand->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'brands' => $brand
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'brands' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $brand = Brand::find($id);
        if ($brand == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'brands' => null
            ];
            return response()->json($result);
        }
        $brand->status = 2;
        $brand->updated_at =  date('Y-m-d H:i:s');
        $brand->updated_by =  1;
        if ($brand->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'brands' => $brand
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'brands' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $brand = Brand::find($id);
        if ($brand == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'brands' => null
            ];
            return response()->json($result);
        }
        if ($brand->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'brands' => $brand
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'brands' => null
            ];
        }
        return response()->json($result);
    }
}
