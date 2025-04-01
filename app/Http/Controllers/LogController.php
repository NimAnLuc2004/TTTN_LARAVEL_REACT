<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogController extends Controller
{
    public function getLogs()
    {
        return Log::latest()->paginate(10);
    }    

    public function destroy($id)
    {
        $log = Log::find($id);
        if ($log == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'log' => null
            ];
            return response()->json($result);
        }
        if ($log->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'log' => $log
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'log' => null
            ];
        }
        return response()->json($result);
    }

    public function storeLog(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|max:255',
            'description' => 'required|string'
        ]);
    
        try {
            $log = Log::create([
                'user_id' => Auth::id(),  // Người tạo log
                'action' => $validated['action'],
                'description' => $validated['description'],
                'ip_address' => $request->ip(),
                'created_by' => Auth::id(),  // Gán created_by
            ]);
    
            return response()->json([
                'status' => true,
                'message' => 'Log đã được lưu',
                'log' => $log
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể lưu log',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
