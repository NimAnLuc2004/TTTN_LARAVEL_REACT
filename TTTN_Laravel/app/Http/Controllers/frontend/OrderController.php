<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductSale;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use Exception;

class OrderController extends Controller
{
    public function addOrderFromCart(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'products' => 'required|array|min:1',
                'products.*.product_id' => 'required|exists:product_details,id',
                'products.*.quantity' => 'required|integer|min:1',
                'payment_method' => 'required|string|in:VNPay,Momo,Paypal,Stripe',
                'code' => 'nullable|string',
            ]);

            $userId = $validated['user_id'];
            $products = $validated['products'];
            $paymentMethod = $validated['payment_method'];
            $discountCode = $validated['code'];
            $today = now();

            $discount = null;
            $discountPercent = 0;
            if ($discountCode) {
                $discount = Discount::where('code', $discountCode)
                    ->where('status', 1)
                    ->where(function ($q) use ($today) {
                        $q->whereNull('valid_until')->orWhere('valid_until', '>=', $today);
                    })
                    ->first();

                if ($discount) {
                    $discountPercent = $discount->discount_percent;
                }
            }

            $orderItems = [];
            $totalAmount = 0;
            $discountApplied = false;

            // Lấy danh sách product_id từ products
            $productIds = array_column($products, 'product_id');

            foreach ($products as $item) {
                $productDetail = ProductDetail::findOrFail($item['product_id']);
                $product = Product::findOrFail($productDetail->product_id);
                $price = $productDetail->price;
                $quantity = $item['quantity'];

                $productSale = ProductSale::where('product_id', $product->id)
                    ->where(function ($q) use ($today) {
                        $q->whereNull('start_date')->orWhere('start_date', '<=', $today);
                    })
                    ->where(function ($q) use ($today) {
                        $q->whereNull('end_date')->orWhere('end_date', '>=', $today);
                    })
                    ->orderByDesc('discount_percent')
                    ->first();

                $discountProduct = $productSale?->discount_percent ?? 0;

                $thisDiscount = $discountProduct;
                if (!$discountApplied && $discount) {
                    $thisDiscount += $discountPercent;
                    $discountApplied = true;
                }

                $priceAfterDiscount = $price - ($price * $thisDiscount / 100);
                $subtotal = $priceAfterDiscount * $quantity;
                $totalAmount += $subtotal;

                $store = DB::table('product_stores')
                    ->where('product_id', $productDetail->id)
                    ->where('status', 1)
                    ->first();

                if (!$store || $store->qty < $quantity) {
                    return response()->json([
                        'status' => false,
                        'message' => "Không đủ hàng cho biến thể: {$product->name} ({$productDetail->name}, {$productDetail->color}, {$productDetail->size})",
                    ], 400);
                }

                DB::table('product_stores')
                    ->where('product_id', $productDetail->id)
                    ->where('status', 1)
                    ->decrement('qty', $quantity);

                $orderItems[] = [
                    'product_id' => $productDetail->id,
                    'quantity' => $quantity,
                    'price' => $priceAfterDiscount,
                ];
            }

            $order = Order::create([
                'user_id' => $userId,
                'total' => $totalAmount,
                'status' => 'pending',
                'created_by' => Auth::id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => $paymentMethod,
                'status' => 'pending',
                'created_by' => Auth::id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Xóa các sản phẩm đã chọn khỏi giỏ hàng
            Cart::where('user_id', $userId)
                ->whereIn('product_id', $productIds)
                ->delete();

            if ($discount && $discountApplied) {
                $discount->update(['status' => 0]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Đã tạo đơn hàng thành công!',
                'data' => [
                    'order' => $order,
                    'payment' => $payment,
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi tạo đơn hàng: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function checkout(Request $request)
    {
        return $this->addOrderFromCart($request);
    }

    public function confirmOrder(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'payment_method' => 'required|string|in:VNPay,Momo,Paypal,Stripe',
            ]);

            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
                ], 401);
            }

            $order = Order::where('id', $id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$order) {
                return response()->json([
                    'status' => false,
                    'message' => 'Đơn hàng không tồn tại hoặc không thuộc về bạn.',
                ], 404);
            }

            if ($order->status !== 'pending') {
                return response()->json([
                    'status' => false,
                    'message' => 'Đơn hàng không ở trạng thái chờ xác nhận.',
                ], 400);
            }

            $payment = Payment::where('order_id', $order->id)->first();
            if (!$payment) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy thông tin thanh toán.',
                ], 404);
            }

            $payment->payment_method = $validated['payment_method'];
            $payment->status = 'pending'; // Sử dụng giá trị hợp lệ trong ENUM
            $payment->updated_at = now();
            $payment->save();

            $order->status = 'pending'; // Sử dụng giá trị hợp lệ trong ENUM
            $order->updated_at = now();
            $order->save();

            $paymentUrl = $this->generatePaymentUrl($order, $payment);

            return response()->json([
                'status' => true,
                'message' => 'Đơn hàng đã được xác nhận.',
                'data' => [
                    'order' => $order,
                    'payment' => $payment,
                    'payment_url' => $paymentUrl,
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xác nhận đơn hàng: ' . $e->getMessage(),
            ], 500);
        }
    }

    protected function generatePaymentUrl($order, $payment)
    {
        return 'https://payment-gateway.example.com/pay?order_id=' . $order->id;
    }


    // Lịch sử đơn hàng
    public function getOrderHistory()
    {
        // Lấy lịch sử đơn hàng của người dùng
        $orders = Order::where('user_id', Auth::id())

            ->with(['orderItems', 'payment'])
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Lịch sử đơn hàng',
            'data' => $orders
        ]);
    }

    // Thêm địa chỉ vào đơn hàng
    public function addAddressToOrder(Request $request)
    {
        // Validate request
        $request->validate([
            'address' => 'required|string|min:10',
            'phone' => 'required|string|regex:/^[0-9]{10,11}$/',
        ]);

        try {
            // Kiểm tra xem người dùng đã có địa chỉ cũ chưa
            $existingAddresses = ShippingAddress::where('user_id', Auth::id())->get();

            // Xóa tất cả địa chỉ cũ (nếu có)
            if ($existingAddresses->isNotEmpty()) {
                ShippingAddress::where('user_id', Auth::id())->delete();
            }

            // Tạo địa chỉ mới
            $address = new ShippingAddress();
            $address->user_id = Auth::id();
            $address->address = $request->address;
            $address->phone = $request->phone;
            $address->created_at = now();
            $address->created_by = Auth::id();
            $address->save();

            return response()->json([
                'status' => true,
                'message' => 'Địa chỉ đã được cập nhật thành công',
                'data' => $address
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi cập nhật địa chỉ: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getRecentOrderItem(Request $request)
    {
        // Lấy mục đơn hàng gần đây nhất, liên kết với order và product_detail (bao gồm product và images)
        $orderItem = OrderItem::with(['order', 'product.product.images'])
            ->latest('id')
            ->first();

        if (!$orderItem || !$orderItem->order || !$orderItem->product || !$orderItem->product->product) {
            return response()->json([
                'status' => false,
                'message' => 'No recent order items found or incomplete data.',
                'data' => null,
            ], 404);
        }

        // Tính thời gian "ago" từ created_at của order
        $timeAgo = Carbon::parse($orderItem->order->created_at)->diffForHumans();

        // Lấy tên sản phẩm từ product
        $productName = $orderItem->product->product
            ? $orderItem->product->product->name
            : 'Unknown Product';

        // Lấy hình ảnh đầu tiên từ product_images (hoặc null nếu không có)
        $imageUrl = $orderItem->product->product && $orderItem->product->product->images->first()
            ? asset('images/product/' . $orderItem->product->product->images->first()->image_url)
            : null;

        return response()->json([
            'status' => true,
            'message' => 'Recent order item retrieved successfully.',
            'data' => [
                'product_name' => $productName,
                'image_url' => $imageUrl,
                'time_ago' => $timeAgo,
                'order_item_id' => $orderItem->id,
            ],
        ], 200);
    }

    public function getUserAddress(Request $request)
    {
        $address = ShippingAddress::where('user_id', Auth::id())
            ->latest('created_at')
            ->first();

        if (!$address) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy địa chỉ nào.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Lấy địa chỉ thành công.',
            'data' => [
                'phone' => $address->phone,
                'address' => $address->address,
            ],
        ], 200);
    }
}
