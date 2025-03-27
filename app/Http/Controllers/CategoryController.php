<?php

namespace App\Http\Controllers;


use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('status', '!=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "image", "status", "parent_id")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'categories' => $categories
        ];
        return response()->json($result);
    }
    public function trash()
    {
        $categories = Category::where('status', '=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "image", "status", "parent_id")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'categories' => $categories
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $category = Category::find($id);
        if ($category == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'categories' => $category
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'categories' => $category
            ];
        }
        return response()->json($result);
    }
    public function store(StoreCategoryRequest $request)
    {
        $categories = [];
        $count=1;
        // Kiểm tra và xử lý từng hình ảnh
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') .$count. '.' . $exten;
                $image->move(public_path('images/category'), $imageName);
                $categories[] = $imageName;
                $count++;
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Không có hình ảnh nào được tải lên.']);
        }

        $category = new Category();
        $category->name =  $request->name;
        $category->parent_id = $request->parent_id == 0 ? null : $request->parent_id;

        $category->image = json_encode($categories);
        $category->created_at =  date('Y-m-d H:i:s');
        $category->status =  $request->status;
        if ($category->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'categories' => $category
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'categories' => null
            ];
        }
        return response()->json($result);
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::find($id);

        if ($category == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'categories' => null
            ]);
        }


        $category->name = $request->name;
        $category->parent_id = $request->parent_id == 0 ? null : $request->parent_id;


        // Xử lý nhiều hình ảnh
        $categories = [];
        $count=1;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') . $count.'.' . $exten;
                $image->move(public_path('images/category'), $imageName);
                $categories[] = $imageName;
                $count++;
            }

            // Cập nhật hình ảnh mới nếu có
            $category->image = json_encode($categories);
        } else {
    
            $category->image = $category->image; 
        }


        $category->updated_at = date('Y-m-d H:i:s');
        $category->status = $request->status;

        // Lưu lại thay đổi
        if ($category->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật thành công',
                'categories' => $category
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thể cập nhật',
                'categories' => null
            ]);
        }
    }
    public function status($id)
    {
        $category = Category::find($id);
        if ($category == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'categories' => null
            ];
            return response()->json($result);
        }
        $category->status = ($category->status == 1) ? 2 : 1;
        $category->updated_at =  date('Y-m-d H:i:s');
        if ($category->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'categories' => $category
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'categories' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $category = Category::find($id);
        if ($category == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'categories' => null
            ];
            return response()->json($result);
        }
        $category->status = 0;
        $category->updated_at =  date('Y-m-d H:i:s');
        if ($category->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'categories' => $category
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'categories' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $category = Category::find($id);
        if ($category == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'categories' => null
            ];
            return response()->json($result);
        }
        $category->status = 2;
        $category->updated_at =  date('Y-m-d H:i:s');
        if ($category->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'categories' => $category
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'categories' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $category = Category::find($id);
        if ($category == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'categories' => null
            ];
            return response()->json($result);
        }
        if ($category->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'categories' => $category
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'categories' => null
            ];
        }
        return response()->json($result);
    }
}
