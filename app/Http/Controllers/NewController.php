<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NewController extends Controller
{
    private function writeLog($action, $table, $recordId, $description)
    {
        Log::create([
            'user_id' => Auth::id() ,
            'action' => $action,
            'table_name' => $table,
            'record_id' => $recordId,
            'description' => $description,
        ]);
    }
    public function index()
    {
        $new = News::where('status', '!=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "title","status")
            ->paginate(10); 
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'new' => $new
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'new' => $new
            ];
        }
        return response()->json($result);
    }
    public function status($id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        $new->status = ($new->status == 1) ? 2 : 1;
        $new->updated_by =  Auth::id();
        $new->updated_at =  date('Y-m-d H:i:s');
        if ($new->save()) {
            $this->writeLog('status', 'news', $new->id, 'Thay đổi trạng thái tin tức');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'new' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        $new->status = 0;
        $new->updated_by =  Auth::id();
        $new->updated_at =  date('Y-m-d H:i:s');
        if ($new->save()) {
            $this->writeLog('delete', 'news', $new->id, 'Xóa tạm tin tức');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'new' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        $new->status = 2;
        $new->updated_by =  Auth::id();
        $new->updated_at =  date('Y-m-d H:i:s');
        if ($new->save()) {
            $this->writeLog('restore', 'news', $new->id, 'Khôi phục tin tức');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'new' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        $idLog = $new->id;
        $newData = $new->toJson();
        if ($new->delete()) {
            $this->writeLog('destroy', 'news', $idLog , 'Xóa vĩnh viễn tin tức:'.$newData);
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'new' => null
            ];
        }
        return response()->json($result);
    }
    public function trash()
    {
        $new = News::where('status', '=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "title","status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'new' => $new
        ];
        return response()->json($result);
    }
    public function store(Request $request)
    {

        $new = new News();
        $new->title =  $request->title;
        $new->content =  $request->content;
        $new->status =  $request->status;
        $new->created_at =  date('Y-m-d H:i:s');
        $new->created_by =  Auth::id();
        if ($new->save()) {
            $this->writeLog('create', 'news', $new->id, 'Thêm mới tin tức');
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'new' => null
            ];
        }
        return response()->json($result);
    }
    public function update(Request $request, $id)
    {
        $new = News::find($id);
        if ($new == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'new' => null
            ];
            return response()->json($result);
        }
        $new->title =  $request->title;
        $new->content =  $request->content;
        $new->status =  $request->status;
        $new->updated_at =  date('Y-m-d H:i:s');
        $new->updated_by =  Auth::id();
        if ($new->save()) {
            $this->writeLog('update', 'news', $new->id, 'Cập nhật tin tức:'.$new->toJson());
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'new' => $new
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'new' => null
            ];
        }
        return response()->json($result);
    }
}
