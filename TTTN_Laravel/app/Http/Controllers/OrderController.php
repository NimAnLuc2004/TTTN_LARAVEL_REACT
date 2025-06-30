<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
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
        $orders = Order::where('status', '!=', "cancelled")
            ->orderBy('created_at', 'DESC')
            ->select("id", "user_id", "status", "total")
            ->paginate(10);
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'orders' => $orders
        ];
        return response()->json($result);
    }
    // public function index1()
    // {
    //     // Lấy dữ liệu đơn hàng kèm theo thông tin sản phẩm
    //     $orders = Orderdetail::where('product.status', '=', 1)
    //         ->join('product', 'orderdetail.product_id', '=', 'product.id')
    //         ->select("orderdetail.id", "orderdetail.amount", "orderdetail.qty", "product.id as product_id", "product.name")
    //         ->get();

    //     // Lấy ảnh của sản phẩm cho từng đơn hàng
    //     $orders->each(function ($order) {
    //         $product = Product::with('images')->find($order->product_id);
    //         $order->product_images = $product ? $product->images : []; // Thêm thông tin ảnh vào đơn hàng
    //     });

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Tải dữ liệu thành công',
    //         'orders' => $orders
    //     ]);
    // }


    public function trash()
    {
        $orders = Order::where('status', '=', "cancelled")
            ->orderBy('created_at', 'DESC')
            ->select("id", "user_id", "status", "updated_at")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'orders' => $orders
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $order = Order::find($id);
        if ($order == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'order' => $order
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'order' => $order
            ];
        }
        return response()->json($result);
    }
    public function show1($id)
    {
        $order = Order::find($id);
        $orderitem = OrderItem::where('order_id', $id)->get();

        if (!$order || $orderitem->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'order' => $order,
                'order_items' => []
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'order' => $order,
            'order_items' => $orderitem
        ]);
    }


    public function status(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:pending,processing,shipped,complete,cancelled',
        ]);

        $order->status = $request->status;
        $order->updated_at =  now();
        $order->updated_by =  Auth::id();
        $order->save();
        $this->writeLog('status', 'orders', $order->id, 'Cập nhật trạng thái đơn hàng thành: ' . $request->status);

        return response()->json(
            [

                'status' => true,
                'message' => 'Cập nhật trạng thái thành công',
                'order' => $order
            ]
        );
    }

    public function restore($id)
    {

        $order = Order::find($id);
        if ($order == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'order' => null
            ];
            return response()->json($result);
        }
        $order->status = "pending";
        $order->updated_at =  now();
        $order->updated_by =  Auth::id();
        if ($order->save()) {
            $this->writeLog('restore', 'orders', $order->id, 'Khôi phục đơn hàng về trạng thái pending');
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'order' => $order
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'order' => null
            ];
        }
        return response()->json($result);
    }
    public function destroy($id)
    {
        $order = Order::find($id);
        if ($order == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'order' => null
            ];
            return response()->json($result);
        }
        $idLog = $order->id;
        $Data = $order->toJson();
        if ($order->delete()) {
            $this->writeLog('destroy', 'orders', $idLog, 'Xóa vĩnh viễn đơn hàng:' . $Data);
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'order' => $order
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'order' => null
            ];
        }
        return response()->json($result);
    }
    public function update(Request $request, $id)
    {
        // Kiểm tra đơn hàng có tồn tại không
        $order = Order::find($id);
        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }
        $order->updated_by =  Auth::id();
        $order->updated_at =  now();

        // Kiểm tra dữ liệu hợp lệ
        if (!$request->has('order_items') || !is_array($request->order_items)) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
            ], 400);
        }

        $orderItems = collect($request->order_items);
        $existingItems = OrderItem::where('order_id', $id)->get();

        // Cập nhật hoặc thêm mới sản phẩm vào đơn hàng
        foreach ($orderItems as $item) {
            if (isset($item['id'])) {
                // Cập nhật sản phẩm đã tồn tại
                $orderItem = OrderItem::where('id', $item['id'])->where('order_id', $id)->first();
                if ($orderItem) {
                    $orderItem->update([
                        'product_id' => $item['product_id'] ?? $orderItem->product_id,
                        'quantity' => $item['quantity'] ?? $orderItem->quantity,
                        'price' => $item['price'] ?? $orderItem->price,
                    ]);
                }
            } else {
                // Thêm sản phẩm mới vào đơn hàng
                $newItem = OrderItem::create([

                    'order_id' => $id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
                $this->writeLog('create', 'order_items', $newItem->id, 'Thêm sản phẩm mới vào đơn hàng: ' . $newItem->toJson());
                $order->save();
            }
        }

        // Xóa sản phẩm bị loại bỏ khỏi danh sách mới
        $newItemIds = $orderItems->pluck('id')->filter()->all();
        OrderItem::where('order_id', $id)
            ->whereNotIn('id', $newItemIds)
            ->delete();

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật sản phẩm trong đơn hàng thành công!',
            'order_items' => OrderItem::where('order_id', $id)->get(),
        ]);
    }



    // public function placeOrder(Request $request)
    // {
    //     $order = new Order();

    //     $order->name =  $request->name;
    //     $order->email =  $request->email;
    //     $order->user_id = $request->user_id;
    //     $order->phone = $request->phone;
    //     $order->address = $request->address;
    //     $order->created_at =  date('Y-m-d H:i:s');

    //     $order->status =  1;

    //     if ($order->save()) {

    //         foreach ($request->input('products') as $product) {
    //             $orderDetail = new OrderDetail();

    //             $orderDetail->product_id = $product['product_id'];
    //             $orderDetail->qty = $product['quantity'];
    //             $orderDetail->price = $product['price'];
    //             $orderDetail->discount = isset($product['discount']) ? $product['discount'] : 0;
    //             $orderDetail->amount = $product['quantity'] * $product['price'];
    //             $orderDetail->save();
    //         }

    //         if ($order->save()) {
    //             $result = [
    //                 'status' => true,
    //                 'message' => 'Thêm thành công',
    //                 'order' => $order,
    //                 'orderdetail' => $orderDetail
    //             ];
    //         } else {
    //             $result = [
    //                 'status' => false,
    //                 'message' => 'Không thể thêm',
    //                 'order' => null
    //             ];
    //         }
    //         return response()->json($result);
    //     }
    // }
    public function mostOrderedProduct()
    {
        $topProduct = OrderItem::join('product_details', 'order_items.product_id', '=', 'product_details.id')

            ->select('product_details.id as product_id')
            ->selectRaw('product_details.name as name')
            ->selectRaw('SUM(order_items.quantity) as total_quantity')

            ->groupBy('product_details.id', 'product_details.name')
            ->orderByDesc('total_quantity')
            ->take(5)
            ->get();


        if ($topProduct->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không có dữ liệu'
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tìm kiếm thành công',
            'top_product' => $topProduct
        ]);
    }

    public function topRevenueProducts()
    {
        $topProducts = OrderItem::join('product_details', 'order_items.product_id', '=', 'product_details.id')
            ->select('product_details.id as product_id')
            ->selectRaw('product_details.name as name')
            ->selectRaw('SUM(order_items.quantity * order_items.price) as total_revenue')
            ->groupBy('product_details.id', 'product_details.name')
            ->orderByDesc('total_revenue')
            ->take(5)
            ->get();


        if ($topProducts->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không có dữ liệu'
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tìm kiếm thành công',
            'top_products' => $topProducts
        ]);
    }

    public function totalOrders()
    {
        $totalOrders = Order::count();
        return response()->json([
            'status' => true,
            'message' => 'Tổng số đơn hàng',
            'total_orders' => $totalOrders
        ]);
    }
    public function totalProductsSold()
    {
        $totalSold = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'completed')
            ->sum('order_items.quantity');

        return response()->json([
            'status' => true,
            'message' => 'Tổng số sản phẩm đã bán',
            'total_sold' => $totalSold
        ]);
    }

}
