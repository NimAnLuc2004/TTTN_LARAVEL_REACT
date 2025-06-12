<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Discount;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductSale;
use App\Models\ShippingAddress;
use App\Models\UserDiscount;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log as Logger;

use Exception;

class OrderController extends Controller
{
    public function addOrderFromCart(Request $request)
    {
        return DB::transaction(function () use ($request) {
            try {
                $validated = $request->validate([
                    'user_id' => 'required|exists:users,id',
                    'products' => 'required|array|min:1',
                    'products.*.product_id' => 'required|exists:product_details,id',
                    'products.*.quantity' => 'required|integer|min:1',
                    'payment_method' => 'required|string|in:VNPay,Momo,Paypal,Stripe,COD',
                    'code' => 'nullable|string',
                ]);

                $userId = $validated['user_id'];
                $products = $validated['products'];
                $paymentMethod = $validated['payment_method'];
                $discountCode = $validated['code'];
                $today = now();

                $discount = null;
                $discountPercent = 0;
                $userDiscount = null;
                if ($discountCode) {
                    $discount = Discount::where('code', $discountCode)
                        ->where('status', 1)
                        ->where(function ($q) use ($today) {
                            $q->whereNull('valid_until')->orWhere('valid_until', '>=', $today);
                        })
                        ->first();

                    if ($discount) {
                        $userDiscount = UserDiscount::where('user_id', $userId)
                            ->where('discount_id', $discount->id)
                            ->where('status', 1)
                            ->first();

                        if ($userDiscount) {
                            $discountPercent = $discount->discount_percent;
                        } else {
                            throw new Exception('Mã giảm giá không hợp lệ hoặc đã được sử dụng.');
                        }
                    } else {
                        throw new Exception('Mã giảm giá không tồn tại hoặc không hợp lệ.');
                    }
                }

                $orderItems = [];
                $totalAmount = 0;
                $discountApplied = false;
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
                    if (!$discountApplied && $userDiscount) {
                        $thisDiscount += $discountPercent;
                        $discountApplied = true;
                    }

                    $priceAfterDiscount = $price - ($price * $thisDiscount / 100);
                    $subtotal = $priceAfterDiscount * $quantity;
                    $totalAmount += $subtotal;

                    $store = DB::table('product_stores')
                        ->where('product_id', $productDetail->id)
                        ->where('status', 1)
                        ->lockForUpdate()
                        ->first();

                    if (!$store || $store->qty < $quantity) {
                        throw new Exception("Không đủ hàng cho biến thể: {$product->name} ({$productDetail->name}, {$productDetail->color}, {$productDetail->size})");
                    }

                    DB::table('product_stores')
                        ->where('product_id', $productDetail->id)
                        ->where('status', 1)
                        ->decrement('qty', $quantity);

                    $variantQty = DB::table('product_stores')
                        ->where('product_id', $productDetail->id)
                        ->where('status', 1)
                        ->value('qty');

                    Logger::info('Tồn kho của biến thể', [
                        'product_detail_id' => $productDetail->id,
                        'variant_qty' => $variantQty,
                    ]);

                    if ($variantQty < 5) {
                        $message = "Biến thể sản phẩm {$product->name} (ID: {$product->id}, Biến thể: {$productDetail->name}, {$productDetail->color}, {$productDetail->size}) chỉ còn {$variantQty} sản phẩm trong kho.";
                        if ($variantQty <= 0) {
                            $message = "Biến thể sản phẩm {$product->name} (ID: {$product->id}, Biến thể: {$productDetail->name}, {$productDetail->color}, {$productDetail->size}) đã hết hàng.";
                        }

                        $existingNotification = Notification::where('message', $message)
                            ->where('role', 'admin')
                            ->exists();

                        Logger::info('Kiểm tra thông báo trùng lặp', [
                            'product_detail_id' => $productDetail->id,
                            'exists' => $existingNotification,
                        ]);

                        if (!$existingNotification) {
                            $admin = \App\Models\User::where('role', 'admin')->first();
                            Notification::create([
                                'user_id' => $admin ? $admin->id : null,
                                'message' => $message,
                                'role' => 'admin',
                                'created_by' => Auth::id() ?? ($admin ? $admin->id : 1),
                                'updated_by' => Auth::id() ?? ($admin ? $admin->id : 1),
                            ]);
                        }
                    }

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

                Cart::where('user_id', $userId)
                    ->whereIn('product_id', $productIds)
                    ->delete();

                if ($userDiscount && $discountApplied) {
                    $userDiscount->update(['status' => 0]);
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Đã tạo đơn hàng thành công!',
                    'data' => [
                        'order' => $order,
                        'payment' => $payment,
                    ],
                ]);
            } catch (\Exception $e) {
                Logger::error('Lỗi khi tạo đơn hàng', ['error' => $e->getMessage()]);
                return response()->json([
                    'status' => false,
                    'message' => $e->getMessage(),
                ], 400);
            }
        });
    }

    public function checkStock(Request $request)
    {
        try {
            $validated = $request->validate([
                'products' => 'required|array|min:1',
                'products.*.product_id' => 'required|exists:product_details,id',
                'products.*.quantity' => 'required|integer|min:1',
            ]);

            foreach ($validated['products'] as $item) {
                $productDetail = ProductDetail::findOrFail($item['product_id']);
                $product = Product::findOrFail($productDetail->product_id);
                $quantity = $item['quantity'];

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
            }

            return response()->json([
                'status' => true,
                'message' => 'Tồn kho đủ cho tất cả sản phẩm.',
            ]);
        } catch (Exception $e) {
            Logger::error('Lỗi khi kiểm tra tồn kho', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 400);
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
                'payment_method' => 'required|string|in:VNPay,Momo,Paypal,Stripe,COD',
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
            $payment->updated_at = now();

            $order->updated_at = now();

            if ($validated['payment_method'] === 'Paypal') {

                $payment->status = 'completed';
                $order->status = 'completed';
                Logger::info('Confirm Order: PayPal payment completed', [
                    'order_id' => $id,
                    'payment_status' => $payment->status,
                    'order_status' => $order->status,
                ]);
            } else {

                $payment->status = 'pending';
                $order->status = 'pending';
                Logger::info('Confirm Order: Non-PayPal payment, keeping pending', [
                    'order_id' => $id,
                    'payment_method' => $validated['payment_method'],
                ]);
            }

            $payment->save();
            $order->save();

            $responseData = [
                'status' => true,
                'message' => 'Đơn hàng đã được xác nhận.',
                'data' => [
                    'order' => $order,
                    'payment' => $payment,
                ],
            ];

            if ($validated['payment_method'] === 'VNPay') {
                $responseData['data']['payment_url'] = $this->generatePaymentUrl($order, $payment);
            } else if ($validated['payment_method'] !== 'Paypal' && $validated['payment_method'] !== 'COD') {
                $responseData['data']['payment_url'] = $this->generatePaymentUrl($order, $payment);
            }

            return response()->json($responseData);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xác nhận đơn hàng: ' . $e->getMessage(),
            ], 500);
        }
    }
    protected function generatePaymentUrl($order, $payment)
    {
        if ($payment->payment_method === 'Paypal' || $payment->payment_method === 'COD') {
            return null;
        }

        if ($payment->payment_method === 'VNPay') {
            $vnp_TmnCode = env('VNPAY_TMN_CODE');
            $vnp_HashSecret = env('VNPAY_HASH_SECRET');
            $vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // Sandbox URL, use production URL in live environment
            $vnp_ReturnUrl = env('VNPAY_RETURN_URL', 'https://zstore.click/profile'); // Frontend URL with activeTab=orders
            Logger::info('VNPay: Generated Return URL', ['vnp_ReturnUrl' => $vnp_ReturnUrl]);
            $vnp_TxnRef = $order->id . '_' . time();
            $vnp_OrderInfo = 'Thanh toan don hang ' . $order->id;
            $vnp_Amount = $order->total * 100;
            $vnp_Locale = 'vn';
            $vnp_BankCode = '';
            $vnp_CreateDate = date('YmdHis');
            $vnp_ExpireDate = date('YmdHis', strtotime('+15 minutes'));
            $vnp_IpAddr = request()->ip();

            Logger::info('VNPay Time Check', [
                'vnp_CreateDate' => $vnp_CreateDate,
                'vnp_ExpireDate' => $vnp_ExpireDate,
                'server_time' => now()->format('YmdHis'),
            ]);

            $inputData = [
                'vnp_Version' => '2.1.0',
                'vnp_TmnCode' => $vnp_TmnCode,
                'vnp_Amount' => $vnp_Amount,
                'vnp_Command' => 'pay',
                'vnp_CreateDate' => $vnp_CreateDate,
                'vnp_CurrCode' => 'VND',
                'vnp_IpAddr' => $vnp_IpAddr,
                'vnp_Locale' => $vnp_Locale,
                'vnp_OrderInfo' => $vnp_OrderInfo,
                'vnp_OrderType' => '250000',
                'vnp_ReturnUrl' => $vnp_ReturnUrl,
                'vnp_TxnRef' => $vnp_TxnRef,
                'vnp_ExpireDate' => $vnp_ExpireDate,
            ];

            if ($vnp_BankCode !== '') {
                $inputData['vnp_BankCode'] = $vnp_BankCode;
            }

            ksort($inputData);
            $query = http_build_query($inputData, '', '&', PHP_QUERY_RFC1738);
            $hashdata = $query;

            $vnp_SecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            Logger::info('VNPay: Hash Data', ['hashdata' => $hashdata, 'vnp_SecureHash' => $vnp_SecureHash]);
            $vnp_Url .= '?' . $query . '&vnp_SecureHash=' . $vnp_SecureHash;

            return $vnp_Url;
        }

        return 'https://payment-gateway.example.com/pay?order_id=' . $order->id;
    }

    public function vnpayCallback(Request $request)
    {
        Logger::info('VNPay Callback Started', [
            'request_data' => $request->all(),
            'vnp_TxnRef' => $request->vnp_TxnRef,
            'vnp_ResponseCode' => $request->vnp_ResponseCode,
            'vnp_TransactionStatus' => $request->vnp_TransactionStatus,
        ]);

        try {
            // Kiểm tra tham số bắt buộc
            if (!$request->has('vnp_TxnRef') || !$request->has('vnp_SecureHash')) {
                Logger::error('VNPay Callback: Missing required parameters', [
                    'request_data' => $request->all(),
                ]);
                return response()->json([
                    'status' => false,
                    'message' => 'Thiếu tham số bắt buộc từ VNPay.',
                ], 400);
            }

            $vnp_HashSecret = env('VNPAY_HASH_SECRET');
            $vnp_SecureHash = $request->vnp_SecureHash;
            $inputData = $request->all();
            unset($inputData['vnp_SecureHash']);
            unset($inputData['vnp_SecureHashType']);
            ksort($inputData);
            $hashdata = http_build_query($inputData, '', '&', PHP_QUERY_RFC1738);
            $calculatedHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);

            $orderId = explode('_', $request->vnp_TxnRef)[0];
            if (empty($orderId)) {
                Logger::error('VNPay Callback: Invalid order ID', [
                    'vnp_TxnRef' => $request->vnp_TxnRef,
                ]);
                return response()->json([
                    'status' => false,
                    'message' => 'ID đơn hàng không hợp lệ.',
                ], 400);
            }

            $order = Order::find($orderId);
            if (!$order) {
                Logger::error('VNPay Callback: Order not found', ['order_id' => $orderId]);
                return response()->json([
                    'status' => false,
                    'message' => 'Đơn hàng không tồn tại.',
                ], 404);
            }

            $payment = Payment::where('order_id', $order->id)->first();
            if (!$payment) {
                Logger::error('VNPay Callback: Payment not found', ['order_id' => $orderId]);
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy thông tin thanh toán.',
                ], 404);
            }

            $redirectUrl = env('FRONTEND_REDIRECT_URL', 'https://zstore.click/profile');

            if ($vnp_SecureHash === $calculatedHash) {
                Logger::info('VNPay Callback: Signature valid', [
                    'order_id' => $orderId,
                    'response_code' => $request->vnp_ResponseCode,
                ]);

                if ($request->vnp_ResponseCode == '00') {
                    DB::transaction(function () use ($payment, $order) {
                        $payment->status = 'completed';
                        $order->status = 'completed';
                        $payment->save();
                        $order->save();
                    });
                    Logger::info('VNPay Callback: Payment completed', [
                        'order_id' => $orderId,
                        'payment_status' => $payment->status,
                        'order_status' => $order->status,
                    ]);
                    return redirect($redirectUrl . '?payment_status=success');
                } else {
                    Logger::error('VNPay Callback: Payment failed', [
                        'order_id' => $orderId,
                        'response_code' => $request->vnp_ResponseCode,
                        'transaction_status' => $request->vnp_TransactionStatus,
                    ]);
                    DB::transaction(function () use ($payment, $order) {
                        $payment->status = 'failed';
                        $order->status = 'failed';
                        $payment->save();
                        $order->save();
                    });
                    return redirect($redirectUrl . '?payment_status=failed');
                }
            } else {
                Logger::error('VNPay Callback: Invalid signature', [
                    'order_id' => $orderId,
                    'received_hash' => $vnp_SecureHash,
                    'calculated_hash' => $calculatedHash,
                    'hashdata' => $hashdata,
                ]);
                DB::transaction(function () use ($payment, $order) {
                    $payment->status = 'failed';
                    $order->status = 'failed';
                    $payment->save();
                    $order->save();
                });
                return redirect($redirectUrl . '?payment_status=invalid_signature');
            }
        } catch (\Exception $e) {
            Logger::error('VNPay Callback: Exception', [
                'error' => $e->getMessage(),
                'order_id' => $orderId ?? null,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xử lý callback: ' . $e->getMessage(),
            ], 500);
        }
    }
    // Lịch sử đơn hàng
    public function getOrderHistory()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng hoặc chưa đăng nhập.'
                ], 401);
            }

            // Lấy tất cả đơn hàng của người dùng
            $orders = Order::where('user_id', $user->id)
                ->select(['id', 'created_at', 'total', 'status', 'user_id'])
                ->orderBy('created_at', 'DESC')
                ->with([
                    'orderItems.product.product.images',
                    'payment',
                    'user'
                ])
                ->get();

            // Kiểm tra nếu không có đơn hàng
            if ($orders->isEmpty()) {
                Logger::info('Không tìm thấy đơn hàng cho người dùng', ['user_id' => $user->id]);
                return response()->json([
                    'status' => true,
                    'data' => [],
                    'message' => 'Không tìm thấy đơn hàng.'
                ]);
            }

            // Ánh xạ dữ liệu
            $formattedOrders = $orders->map(function ($order) use ($user) {
                // Lấy địa chỉ giao hàng từ user
                $shippingAddress = null;
                if (method_exists($user, 'shippingAddresses')) {
                    $shippingAddress = $user->shippingAddresses->firstWhere('is_default', true)
                        ?? $user->shippingAddresses->first();
                }

                return [
                    'id' => (string) $order->id,
                    'date' => $order->created_at ? $order->created_at->format('Y-m-d') : '',
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'shippingAddress' => $shippingAddress ? $shippingAddress->address : 'N/A',
                    'shippingphone' => $shippingAddress ? $shippingAddress->phone : 'N/A',
                    'items' => $order->orderItems->map(function ($item) {
                        $image = 'https://via.placeholder.com/50?text=San+Pham';
                        if ($item->product && $item->product->product && $item->product->product->images->isNotEmpty()) {
                            $image = url('images/product/' . $item->product->product->images->first()->image_url);
                        } elseif ($item->image) {
                            $image = url('images/product/' . $item->image_url);
                        }
                        return [
                            'name' => $item->product_name,
                            'quantity' => (int) $item->quantity,
                            'price' => (float) $item->price,
                            'image' => $image,
                        ];
                    })->toArray(),
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'payment' => $order->payment ? [
                        'payment_method' => $order->payment->payment_method,
                        'status' => $order->payment->status,
                    ] : null,
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Lịch sử đơn hàng',
                'data' => $formattedOrders
            ]);
        } catch (\Exception $e) {
            Logger::error('Lỗi trong getOrderHistory', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id() ?? null,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lấy lịch sử đơn hàng.'
            ], 500);
        }
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



    public function trackOrder(Request $request)
    {
        // Validate that at least one of order_id or phone is provided
        $request->validate([
            'order_id' => 'nullable|string|required_without:phone',
            'phone' => 'nullable|string|required_without:order_id',
        ], [
            'order_id.required_without' => 'Vui lòng cung cấp mã đơn hàng hoặc số điện thoại',
            'phone.required_without' => 'Vui lòng cung cấp mã đơn hàng hoặc số điện thoại',
        ]);

        // Initialize query
        $query = Order::where('status', '!=', 'cancelled')
            ->with(['orderItems.product', 'tracking']);

        // Build query based on provided inputs
        if ($request->has('order_id') && $request->has('phone')) {
            // Case: Both order_id and phone are provided
            $query->where(function ($q) use ($request) {
                $q->where('id', $request->order_id)
                    ->orWhereRaw(
                        'EXISTS (SELECT 1 FROM shipping_addresses WHERE shipping_addresses.user_id = orders.user_id AND REPLACE(REPLACE(shipping_addresses.phone, " ", ""), "+", "") = ?)',
                        [str_replace([' ', '+'], '', $request->phone)]
                    );
            });
        } elseif ($request->has('order_id')) {
            // Case: Only order_id is provided
            $query->where('id', $request->order_id);
        } elseif ($request->has('phone')) {
            // Case: Only phone is provided
            $query->leftJoin('shipping_addresses', 'orders.user_id', '=', 'shipping_addresses.user_id')
                ->whereRaw('REPLACE(REPLACE(shipping_addresses.phone, " ", ""), "+", "") = ?', [
                    str_replace([' ', '+'], '', $request->phone)
                ])
                ->select('orders.*');
        }




        $orders = $query->get();

        // Check if no orders were found
        if ($orders->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Đơn hàng không tồn tại',
            ], 404);
        }

        // Map orders to response format
        $response = [
            'status' => true,
            'message' => 'Tải thông tin đơn hàng thành công',
            'data' => $orders->map(function ($order) {
                // Fetch shipping address
                $shippingAddress = ShippingAddress::where('user_id', $order->user_id)->first();

                return [
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                    'status' => $order->status,
                    'total' => $order->total,
                    'created_at' => $order->created_at,
                    'products' => $order->orderItems ? $order->orderItems->map(function ($detail) {
                        return [
                            'product_id' => $detail->product_id,
                            'name' => $detail->product ? $detail->product->name : 'Sản phẩm không tồn tại',
                            'quantity' => $detail->quantity,
                            'price' => $detail->price,
                        ];
                    })->toArray() : [],
                    'tracking' => $order->tracking ? [
                        'status' => $order->tracking->status,
                        'last_updated' => $order->tracking->last_updated,
                        'carrier' => $order->tracking->carrier,
                        'tracking_number' => $order->tracking->tracking_number,
                    ] : null,
                    'shipping_address' => $shippingAddress ? [
                        'address' => $shippingAddress->address,
                        'phone' => $shippingAddress->phone,
                    ] : null,
                ];
            })->toArray(),
        ];

        return response()->json($response);
    }
}
