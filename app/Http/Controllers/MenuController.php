<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;

class MenuController extends Controller
{
    public function index()
    {
        $menu = Menu::where('status', '!=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "link", "type", "position", "status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'menu' => $menu
        ];
        return response()->json($result);
    }
    public function trash()
    {
        $menu = Menu::where('status', '=', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "link", "type", "position", "status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'menu' => $menu
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $menu = Menu::find($id);
        if ($menu == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'menu' => $menu
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'menu' => $menu
            ];
        }
        return response()->json($result);
    }
    public function store(StoreMenuRequest $request)
    {
        $menu = new Menu();
        $menu->name =  $request->name;
        $menu->link =  $request->link;
        $menu->type =  $request->type;
        $menu->table_id =  $request->table_id;

        $menu->position =  $request->position;

        $menu->created_by =  1;
        $menu->created_at =  date('Y-m-d H:i:s');
        $menu->status =  $request->status;
        if ($menu->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'menu' => $menu
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'menu' => null
            ];
        }
        return response()->json($result);
    }

    public function update(UpdateMenuRequest $request, $id)
    {
        $menu = Menu::find($id);
        if ($menu == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tín',
                'menu' => null
            ];
            return response()->json($result);
        }
        $menu->name =  $request->name;
        $menu->link =  $request->link;
        $menu->type =  $request->type;
        $menu->table_id =  $request->table_id;

        $menu->position =  $request->position;

        $menu->created_by =  1;
        $menu->created_at =  date('Y-m-d H:i:s');
        $menu->status =  $request->status;
        if ($menu->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'menu' => $menu
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'menu' => null
            ];
        }
        return response()->json($result);
    }
    public function status($id)
    {
        $menu = Menu::find($id);
        if ($menu == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'menu' => null
            ];
            return response()->json($result);
        }
        $menu->status = ($menu->status == 1) ? 2 : 1;
        $menu->updated_by =  1;
        $menu->updated_at =  date('Y-m-d H:i:s');
        if ($menu->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'menu' => $menu
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'menu' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $menu = Menu::find($id);
        if ($menu == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'menu' => null
            ];
            return response()->json($result);
        }
        $menu->status = 0;
        $menu->updated_by =  1;
        $menu->updated_at =  date('Y-m-d H:i:s');
        if ($menu->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'menu' => $menu
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'menu' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $menu = Menu::find($id);
        if ($menu == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'menu' => null
            ];
            return response()->json($result);
        }
        $menu->status = 2;
        $menu->updated_by =  1;
        $menu->updated_at =  date('Y-m-d H:i:s');
        if ($menu->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'menu' => $menu
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'menu' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $menu = Menu::find($id);
        if ($menu == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'menu' => null
            ];
            return response()->json($result);
        }
        if ($menu->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'menu' => $menu
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'menu' => null
            ];
        }
        return response()->json($result);
    }
}
