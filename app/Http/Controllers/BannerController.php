<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::where('status', '!=', 0)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "image", "status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'banners' => $banners
        ];
        return response()->json($result);
    }
    public function trash()
    {
        $banners = Banner::where('status', '=', 0)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "image", "status",)
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'banners' => $banners
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'banners' => $banner
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'banners' => $banner
            ];
        }
        return response()->json($result);
    }

    public function store(StoreBannerRequest $request)
    {
        $banners = [];
        $count=1;
        // Kiểm tra và xử lý từng hình ảnh
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') . $count.'.' . $exten;
                $image->move(public_path('images/banner'), $imageName);
                
                $banners[] = $imageName; // Lưu tên hình ảnh vào mảng
                $count++;
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Không có hình ảnh nào được tải lên.']);
        }

        // Lưu thông tin banner
        $banner = new Banner();
        $banner->name = $request->name;
        $banner->link = $request->link;
        $banner->image = json_encode($banners); // Chuyển đổi mảng hình ảnh thành JSON nếu bạn muốn lưu nhiều hình ảnh
        $banner->description = $request->description;
        // $banner->position = $request->position;
        $banner->created_by = 1;
        $banner->sort_order = $request->sort_order;
        $banner->created_at = now(); // Sử dụng helper now() để lấy thời gian hiện tại
        $banner->status = $request->status;

        if ($banner->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'banners' => $banner
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thêm',
                'banners' => null
            ];
        }

        return response()->json($result);
    }


    public function update(UpdateBannerRequest $request, $id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'banners' => null
            ]);
        }
        $banner->updated_by = 1;
        $banner->name = $request->name;
        $banner->link = $request->link;
    
        // Xử lý hình ảnh
        if ($request->hasFile('images')) {
            $banners = [];
            $count=1;
    
            // Xóa hình ảnh cũ (nếu cần thiết)
            $oldImages = json_decode($banner->image, true);
            foreach ($oldImages as $oldImage) {
                // Xóa hình ảnh cũ khỏi thư mục
                if (file_exists(public_path('images/banner/' . $oldImage))) {
                    unlink(public_path('images/banner/' . $oldImage));
                }
            }
    
            // Tải lên hình ảnh mới
            foreach ($request->file('images') as $image) {
                $exten = $image->extension();
                $imageName = date('YmdHis') .$count. '.' . $exten;
                $image->move(public_path('images/banner'), $imageName);
                $banners[] = $imageName; // Lưu tên hình ảnh vào mảng
                $count++;
            }
    
            // Cập nhật hình ảnh mới vào banner
            $banner->image = json_encode($banners);
        } else {
            // Nếu không có hình ảnh mới, giữ nguyên hình ảnh cũ
            $banner->image = $banner->image; // Có thể bỏ qua dòng này vì nó sẽ giữ nguyên giá trị cũ
        }
    
        // Cập nhật các trường khác
        $banner->description = $request->description;
        // $banner->position = $request->position;
        $banner->sort_order = $request->sort_order;
        $banner->updated_at = now();
        $banner->status = $request->status;
    
        if ($banner->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật thành công',
                'banners' => $banner
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thể cập nhật',
                'banners' => null
            ]);
        }
    }
    

    public function status($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'banners' => null
            ];
            return response()->json($result);
        }
        $banner->status = ($banner->status == 1) ? 2 : 1;
        $banner->updated_by = 1;
        $banner->updated_at =  date('Y-m-d H:i:s');
        if ($banner->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'banners' => $banner
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'banners' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'banners' => null
            ];
            return response()->json($result);
        }
        $banner->status = 0;
        $banner->updated_by = 1;
        $banner->updated_at =  date('Y-m-d H:i:s');
        if ($banner->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'banners' => $banner
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'banners' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $banner = Banner::find($id);
        if ($banner == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'banners' => null
            ];
            return response()->json($result);
        }
        $banner->status = 2;
        $banner->updated_by = 1;
        $banner->updated_at =  date('Y-m-d H:i:s');
        if ($banner->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'banners' => $banner
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'banners' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'banners' => null
            ];
            return response()->json($result);
        }
        if ($banner->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'banners' => $banner
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'banners' => null
            ];
        }
        return response()->json($result);
    }
}