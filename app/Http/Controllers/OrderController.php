<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('status', '!=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "name", "user_id", "status", "total")
            ->get();
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
        $orders = Order::where('status', '=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "name", "user_id", "status", "total")
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


    public function status($id)
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
        $order->status = ($order->status == 1) ? 2 : 1;
        $order->updated_at =  date('Y-m-d H:i:s');
        if ($order->save()) {
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
        $order->status = 2;
        $order->updated_by =  1;
        $order->updated_at =  date('Y-m-d H:i:s');
        if ($order->save()) {
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
    public function delete($id)
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
        $order->status = 0;
        $order->updated_at =  date('Y-m-d H:i:s');
        if ($order->save()) {
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
        if ($order->delete()) {
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
        $order = Order::find($id);
        if ($order == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tín',
                'order' => null
            ];
            return response()->json($result);
        }
        $order->name =  $request->name;

        $order->total =  $request->total;
        $order->user_id =  $request->user_id;
        $order->updated_at =  date('Y-m-d H:i:s');
        $order->status =  $request->status;
        if ($order->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'order' => $order
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'order' => null
            ];
        }
        return response()->json($result);
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
        $topProduct = OrderItem::select('product_id')
            ->groupBy('product_id')
            ->selectRaw('SUM(quantity) as total_quantity')
            ->orderByDesc('total_quantity')
            ->take(5)
            ->get();

        if (!$topProduct) {
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
        $topProducts = OrderItem::select('product_id')
            ->groupBy('product_id')
            ->selectRaw('SUM(quantity * price) as total_revenue')
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
