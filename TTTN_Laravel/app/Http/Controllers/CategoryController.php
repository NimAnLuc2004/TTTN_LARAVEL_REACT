<?php

namespace App\Http\Controllers;


use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    private function writeLog($action, $table, $recordId, $description)
    {
        Log::create([
            'user_id' =>  Auth::id(),
            'action' => $action,
            'table_name' => $table,
            'record_id' => $recordId,
            'description' => $description,
        ]);
    }
    public function index(Request $request)
    {
        $query = Category::where('status', '!=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "name", "image", "status", "parent_id");
        // Nếu có tham số page thì phân trang, ngược lại lấy tất cả
        if ($request->has('page')) {
            $categories = $query->paginate(10);
        } else {
            $categories = $query->get();
        }

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
            ->orderBy('created_at', 'DESC')
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
        $count = 1;
        // Kiểm tra và xử lý từng hình ảnh
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') . $count . '.' . $exten;
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
        $category->created_by =  Auth::id();
        $category->image = json_encode($categories);
        $category->created_at =  date('Y-m-d H:i:s');
        $category->status =  $request->status;
        if ($category->save()) {
            $this->writeLog('create', 'categories', $category->id, 'Thêm danh mục');

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
        $count = 1;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') . $count . '.' . $exten;
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
        $category->updated_by =  Auth::id();
        // Lưu lại thay đổi
        if ($category->save()) {
            $categoryJson = $category->toJson();
            $this->writeLog('update', 'categories', $category->id, 'Cập nhật danh mục:' . $categoryJson);
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
        $category->updated_by =  Auth::id();
        if ($category->save()) {
            $this->writeLog('status', 'categories', $category->id, 'Thay đổi trạng thái danh mục');

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
        $category->updated_by =  Auth::id();
        $category->updated_at =  date('Y-m-d H:i:s');
        if ($category->save()) {
            $this->writeLog('delete', 'categories', $category->id, 'Xóa mềm danh mục');

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
        $category->updated_by =  Auth::id();
        $category->updated_at =  date('Y-m-d H:i:s');
        if ($category->save()) {
            $this->writeLog('restore', 'categories', $category->id, 'Khôi phục danh mục');

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
        $idLog = $category->id;
        $categoryData = $category->toJson();
        if ($category->delete()) {
            $this->writeLog('destroy', 'categories', $idLog, 'Xóa vĩnh viễn danh mục:' . $categoryData);

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
