<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController as ControllersCartController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\frontend\CartController;
use App\Http\Controllers\frontend\CategoryController as FrontendCategoryController;
use App\Http\Controllers\frontend\FrontendController;
use App\Http\Controllers\frontend\MenuController as FrontendMenuController;
use App\Http\Controllers\frontend\MessageController as FrontendMessageController;
use App\Http\Controllers\frontend\NewController as FrontendNewController;
use App\Http\Controllers\frontend\OrderController as FrontendOrderController;
use App\Http\Controllers\frontend\ProductController as FrontendProductController;
use App\Http\Controllers\frontend\UserController as FrontendUserController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProductStoreController;
use App\Http\Controllers\NewCommentController;
use App\Http\Controllers\NewCommentReactionController;
use App\Http\Controllers\NewController;
use App\Http\Controllers\NewTopicController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ProductSaleController;

use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingAddressController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WishlistController;

use App\Http\Controllers\frontend\ReviewController as FrotendReviewController;
use App\Http\Controllers\frontend\WishListController as FrontendWishListController;
use App\Http\Controllers\UserDiscountController;


// // Lấy thông tin người dùng hiện tại (yêu cầu xác thực)
// Route::get('/user', function (Request $request) {
// 	return $request->user();
// })->middleware('auth:sanctum');

// // Frontend Routes - Không yêu cầu xác thực (Public)
// Route::get('menu_list/{parentid?}/{limit?}', [FrontendMenuController::class, 'menu_list']);
// Route::get('menu_footer', [FrontendMenuController::class, 'menu_footer']);
// // UC3: Lấy danh sách slideshow theo vị trí và giới hạn
// // Route::get('slider_list/{position}/{limit?}', [BannerController::class, 'slider_list']);
// // Lấy tất cả sản phẩm
// Route::get('product', [FrontendProductController::class, 'productall']);
// // Lấy danh sách danh mục theo parent ID
// // Route::get('category_list/{parentid?}', [CategoryController::class, 'category_list']);
// // UC7-2: Lấy sản phẩm theo danh mục với giới hạn
// // Route::get('product_category/categoryid/{limit}', [ProductController::class, 'product_category']);
// // UC8: Lấy bài viết mới nhất với giới hạn
// Route::get('post_new/{limit}', [FrontendPostController::class, 'post_new']);
// // UC9: Lấy trang bài viết đơn theo slug
// Route::get('post_page/{slug}', [FrontendPostController::class, 'post_page']);
// // UC12: Lấy tất cả bài viết theo chủ đề với giới hạn
// Route::get('post_all/{topicid}/{limit}', [FrontendPostController::class, 'post_all']);
// // UC13: Lấy chi tiết bài viết theo slug với giới hạn
// Route::get('post_detail/{slug}/{limit}', [FrontendPostController::class, 'post_detail']);
// // UC14: Lưu thông tin liên hệ
// Route::post('contact/store', [FrontendController::class, 'store']);

// Frontend Routes - Không yêu cầu xác thực (Public)
Route::prefix('frontend')->group(function () {
	Route::post('/forgot-password', [FrontendUserController::class, 'forgotPassword']);
	Route::post('/reset-password', [FrontendUserController::class, 'resetPassword']);
	// UC: Lấy danh sách đánh giá
	Route::get('/review', [FrontendController::class, 'getReview']);

	// Nhóm tuyến đường cho đánh giá sản phẩm
	Route::prefix('reviews')->group(function () {
		// Lấy đánh giá theo sản phẩm, phân trang
		Route::get('/product/{product_id}', [FrotendReviewController::class, 'getByProductPaginated']);
		// Lấy trung bình số sao của sản phẩm
		Route::get('/product/{product_id}/average', [FrotendReviewController::class, 'averageRating']);
	});

	// UC: Lấy danh sách menu với giới hạn
	Route::get('menu_list/{limit}', [FrontendMenuController::class, 'menu_list']);

	// UC: Lấy danh sách banner
	Route::get('banner_list', [FrontendController::class, 'banner_list']);

	// UC: Lấy menu chân trang với giới hạn
	Route::get('menu_footer/{limit}', [FrontendMenuController::class, 'menu_footer']);

	// UC: Lấy sản phẩm theo danh mục
	Route::get('/products/by-category', [FrontendProductController::class, 'productsByCategory']);

	// UC: Lấy danh sách danh mục
	Route::get('category/list', [FrontendCategoryController::class, 'category_list']);

	// UC4: Lấy sản phẩm mới với giới hạn
	Route::get('product_new/{limit}', [FrontendProductController::class, 'product_new']);

	// UC5: Lấy sản phẩm khuyến mãi với giới hạn
	Route::get('product_sale/{limit}', [FrontendProductController::class, 'product_sale']);

	// UC6: Lấy sản phẩm bán chạy với giới hạn
	Route::get('product_bestseller/{limit}', [FrontendProductController::class, 'product_bestseller']);

	// UC7.1: Gửi tin nhắn
	Route::post('message', [FrontendMessageController::class, 'message']);


	// UC7: Lấy tin nhắn theo ID người dùng
	Route::get('message/{user_id}', [FrontendMessageController::class, 'getMessagesByUser']);

	// UC7: Lấy tin nhắn theo ID cuộc trò chuyện
	Route::get('message/chat/{chat_id}', [FrontendMessageController::class, 'getMessagesByChat']);

	// UC: Lấy danh sách sản phẩm từ đơn hàng gần nhất
	Route::get('/recent-order-item', [FrontendOrderController::class, 'getRecentOrderItem']);

	// UC8: Lấy danh sách tin tức với giới hạn
	Route::get('/news/list/{limit}', [FrontendNewController::class, 'new_list']);

	// UC8.1: Lấy danh sách tin tức theo chủ đề với giới hạn
	Route::get('/news/topic/{limit}/{topic_id}', [FrontendNewController::class, 'new_list1']);

	// UC8.1: Lấy danh sách chủ đề tin tức
	Route::get('/news/topics', [FrontendNewController::class, 'getTopics']);

	Route::get('/vnpay/callback', [FrontendOrderController::class, 'vnpayCallback'])->name('vnpay.callback');

	// UC8.1: Lấy bình luận của tin tức theo ID
	Route::get('/news/comments/{news_id}', [FrontendNewController::class, 'getComments']);

	// UC9: Lấy chi tiết tin tức theo ID
	Route::get('/news/detail/{id}', [FrontendNewController::class, 'new_detail']);

	// UC: Lấy danh sách tất cả thương hiệu
	Route::get('/get_all_brands', [FrontendProductController::class, 'getAllBrands']);

	// UC10: Lấy tất cả sản phẩm (phiên bản khác)
	Route::get('product_all1', [FrontendProductController::class, 'productall1']);

	// UC11: Lấy chi tiết sản phẩm theo ID với giới hạn
	Route::get('product_detail/{id}/{limit}', [FrontendProductController::class, 'product_detail']);

	// UC: Lấy sản phẩm được đánh giá cao nhất với giới hạn
	Route::get('product_top_rated/{limit}', [FrontendProductController::class, 'product_top_rated']);

	// UC: Tìm kiếm sản phẩm
	Route::get('product_search', [FrontendProductController::class, 'product_search']);

	// UC: Lấy sản phẩm sắp hết ưu đãi với giới hạn
	Route::get('/product_deal_of_the_day/{limit}', [FrontendProductController::class, 'product_deal_of_the_day']);

	// UC15: Đăng ký tài khoản khách hàng
	Route::post('customer/register', [FrontendUserController::class, 'customer_register']);

	// UC16: Đăng nhập tài khoản khách hàng
	Route::post('customer/login', [FrontendUserController::class, 'loginuser']);
});

// Frontend Routes - Yêu cầu xác thực (Authenticated)
Route::prefix('frontend')->middleware('auth:sanctum')->group(function () {

	// UC: Lưu thông tin liên hệ
	Route::post('/contact', [FrontendController::class, 'store']);
	// UC: Lấy danh sách vouchers
	Route::get('/vouchers', [FrontendController::class, 'index']);

	// UC: Thêm bình luận cho tin tức
	Route::post('/news/comment/{news_id}', [FrontendNewController::class, 'addComment']);

	// UC: Thêm/thay đổi phản ứng cho bình luận tin tức
	Route::post('/news/comment/{comment_id}/reaction', [FrontendNewController::class, 'toggleReaction']);

	// UC: Lấy thông tin hồ sơ người dùng
	Route::get('user/profile', [FrontendUserController::class, 'getUserProfile']);

	// UC: Cập nhật hồ sơ người dùng
	Route::post('user/profile/update', [FrontendUserController::class, 'updateProfile']);

	// UC: Lấy danh sách thông báo
	Route::get('/notifications', [FrontendController::class, 'index1']);

	// UC: Hủy đơn hàng
	Route::post('/orders/{orderId}/cancel', [FrontendUserController::class, 'cancelOrder']);

	// UC: Theo dõi trạng thái đơn hàng
	Route::get('/order/track', [FrontendOrderController::class, 'trackOrder']);

	// UC: Cập nhật thông tin tài khoản người dùng
	Route::post('user/update-account', [FrontendUserController::class, 'updateAccount']);

	// UC: Lấy thông tin người dùng
	Route::get('user', [FrontendMessageController::class, 'getUser']);

	// UC: Tạo cuộc trò chuyện mới
	Route::post('chat/add', [FrontendMessageController::class, 'createChat']);

	// UC: Đếm số lượng sản phẩm trong danh sách yêu thích
	Route::get('wishlist/count', [FrontendWishListController::class, 'wishlistCount']);

	// UC: Đếm số lượng sản phẩm trong giỏ hàng
	Route::get('cart/count', [CartController::class, 'cartCount']);

	// UC: Kiểm tra sản phẩm có trong danh sách yêu thích không
	Route::get('wishlist/check/{productId}', [FrontendWishListController::class, 'check']);

	// UC: Lấy danh sách yêu thích của người dùng
	Route::get('wishlist/{user_id}', [FrontendWishListController::class, 'index']);

	// UC: Thêm sản phẩm vào danh sách yêu thích
	Route::post('wishlist/store', [FrontendWishListController::class, 'store']);

	// UC: Xóa sản phẩm khỏi danh sách yêu thích
	Route::delete('wishlist', [FrontendWishListController::class, 'destroy']);

	// Nhóm tuyến đường cho đánh giá sản phẩm (Authenticated)
	Route::prefix('reviews')->group(function () {
		// Tạo đánh giá mới
		Route::post('/store', [FrotendReviewController::class, 'store']);
		// Lấy đánh giá theo người dùng
		Route::get('/user/{user_id}', [FrotendReviewController::class, 'getByUser']);
		// Cập nhật đánh giá
		Route::put('/{id}', [FrotendReviewController::class, 'update']);
		// Xóa đánh giá
		Route::delete('/{id}', [FrotendReviewController::class, 'destroy']);
	});

	// Nhóm tuyến đường cho đơn hàng
	Route::post('/order/add', [FrontendOrderController::class, 'addOrderFromCart']);
	// Kiểm tra tồn kho trước khi đặt hàng
	Route::post('/order/check-stock', [FrontendOrderController::class, 'checkStock']);
	// Thanh toán đơn hàng
	Route::post('/order/checkout', [FrontendOrderController::class, 'checkout']);
	// Thêm địa chỉ giao hàng vào đơn hàng
	Route::post('/order/add-address', [FrontendOrderController::class, 'addAddressToOrder']);
	// Xác nhận đơn hàng
	Route::patch('/order/{id}/confirm', [FrontendOrderController::class, 'confirmOrder']);
	// Thêm địa chỉ giao hàng vào đơn hàng (trùng lặp)
	Route::post('order/add-address', [FrontendOrderController::class, 'addAddressToOrder']);
	// Lấy địa chỉ giao hàng của người dùng
	Route::get('/order/address', [FrontendOrderController::class, 'getUserAddress']);
	// Lấy lịch sử đơn hàng
	Route::get('order/history', [FrontendOrderController::class, 'getOrderHistory']);

	// Nhóm tuyến đường cho giỏ hàng
	// Thêm sản phẩm vào giỏ hàng
	Route::post('cart/store', [CartController::class, 'store']);
	// Lấy lịch sử giỏ hàng
	Route::get('cart/history', [CartController::class, 'getCartHistory']);
	// Lấy danh sách mã giảm giá
	Route::get('discount', [CartController::class, 'getDiscounts']);
	// Xóa sản phẩm khỏi giỏ hàng
	Route::delete('/cart/clear/{productId}', [CartController::class, 'removeProductFromCart']);
	// Cập nhật số lượng sản phẩm trong giỏ hàng
	Route::put('cart/quantity/{productId}', [CartController::class, 'updateQuantityInCart']);
	Route::get("logout", [FrontendUserController::class, "logout"]);
});
// // Route cho trang quản lý
// //UC20: Đăng nhập
Route::post('admin/login', [UserController::class, 'login']);
Route::post('/auth/google', [FrontendUserController::class, 'handleGoogleCallback']);

Route::group(["middleware" => ["auth:sanctum", "admin"]], function () {
	Route::get("admin/profile", [UserController::class, "profile"]);
	Route::get("logout", [UserController::class, "logout"]);
	//UC 22: Quản lý banner
	Route::prefix('banner')->group(function () {
		Route::get('/', [BannerController::class, 'index']);
		Route::get('/trash', [BannerController::class, 'trash']);
		Route::get('/show/{id}', [BannerController::class, 'show']);
		Route::post('/store', [BannerController::class, 'store']);
		Route::post('/update/{id}', [BannerController::class, 'update']);
		Route::get('/status/{id}', [BannerController::class, 'status']);
		Route::get('/delete/{id}', [BannerController::class, 'delete']);
		Route::get('/restore/{id}', [BannerController::class, 'restore']);
		Route::delete('/destroy/{id}', [BannerController::class, 'destroy']);
	});
	//UC 23: Quản lý thương hiệu
	Route::prefix('brand')->group(function () {
		Route::get('/', [BrandController::class, 'index']);
		Route::get('/trash', [BrandController::class, 'trash']);
		Route::get('/show/{id}', [BrandController::class, 'show']);
		Route::post('/store', [BrandController::class, 'store']);
		Route::post('/update/{id}', [BrandController::class, 'update']);
		Route::get('/status/{id}', [BrandController::class, 'status']);
		Route::get('/delete/{id}', [BrandController::class, 'delete']);
		Route::get('/restore/{id}', [BrandController::class, 'restore']);
		Route::delete('/destroy/{id}', [BrandController::class, 'destroy']);
	});
	//UC 24: Quản lý danh mục
	Route::prefix('category')->group(function () {
		Route::get('/', [CategoryController::class, 'index']);
		Route::get('/trash', [CategoryController::class, 'trash']);
		Route::get('/show/{id}', [CategoryController::class, 'show']);
		Route::post('/store', [CategoryController::class, 'store']);
		Route::post('/update/{id}', [CategoryController::class, 'update']);
		Route::get('/status/{id}', [CategoryController::class, 'status']);
		Route::get('/delete/{id}', [CategoryController::class, 'delete']);
		Route::get('/restore/{id}', [CategoryController::class, 'restore']);
		Route::delete('/destroy/{id}', [CategoryController::class, 'destroy']);
	});
	//UC 25: Quản lý menu
	Route::prefix('menu')->group(function () {
		Route::get('/', [MenuController::class, 'index']);
		Route::get('/trash', [MenuController::class, 'trash']);
		Route::get('/show/{id}', [MenuController::class, 'show']);
		Route::post('/store', [MenuController::class, 'store']);
		Route::post('/update/{id}', [MenuController::class, 'update']);
		Route::get('/status/{id}', [MenuController::class, 'status']);
		Route::get('/delete/{id}', [MenuController::class, 'delete']);
		Route::get('/restore/{id}', [MenuController::class, 'restore']);
		Route::delete('/destroy/{id}', [MenuController::class, 'destroy']);
	});
	//UC 26: Quản lý liên hệ
	Route::prefix('contact')->group(function () {
		Route::get('/', [ContactController::class, 'index']);
		Route::get('/trash', [ContactController::class, 'trash']);
		Route::get('/show/{id}', [ContactController::class, 'show']);
		Route::get('/replay/{id}', [ContactController::class, 'replay']);
		Route::get('/status/{id}', [ContactController::class, 'status']);
		Route::post('/update/{id}', [ContactController::class, 'update']);
		Route::get('/delete/{id}', [ContactController::class, 'delete']);
		Route::get('/restore/{id}', [ContactController::class, 'restore']);
		Route::delete('/destroy/{id}', [ContactController::class, 'destroy']);
	});
	//UC 29: Quản lý thành viên
	Route::prefix('user')->group(function () {
		Route::get('/', [UserController::class, 'index']);
		Route::get('/trash', [UserController::class, 'trash']);
		Route::get('/show/{id}', [UserController::class, 'show']);
		Route::post('/store', [UserController::class, 'store']);
		Route::post('/update/{id}', [UserController::class, 'update']);
		Route::get('/status/{id}', [UserController::class, 'status']);
		Route::get('/delete/{id}', [UserController::class, 'delete']);
		Route::get('/restore/{id}', [UserController::class, 'restore']);
		Route::delete('/destroy/{id}', [UserController::class, 'destroy']);
	});
	//UC 30: Quản lý đơn hàng
	Route::prefix('order')->group(function () {
		Route::get('/', [OrderController::class, 'index']);
		Route::get('/orderdetail', [OrderController::class, 'index1']);
		Route::get('/trash', [OrderController::class, 'trash']);
		Route::get('/show/{id}', [OrderController::class, 'show']);
		Route::get('/show/orderitem/{id}', [OrderController::class, 'show1']);
		Route::post('/update/{id}', [OrderController::class, 'update']);
		Route::get('/delete/{id}', [OrderController::class, 'delete']);
		Route::put('/status/{id}', [OrderController::class, 'status']);
		Route::delete('/destroy/{id}', [OrderController::class, 'destroy']);
		Route::get('/restore/{id}', [OrderController::class, 'restore']);
		Route::post('/placeOrder', [OrderController::class, 'placeOrder']);
	});
	//UC 31: Quản lý sản phẩm
	Route::prefix('product')->group(function () {
		Route::get('/', [ProductController::class, 'index']);
		Route::get('/trash', [ProductController::class, 'trash']);
		Route::get('/show/{id}', [ProductController::class, 'show']);
		Route::post('/store', [ProductController::class, 'store']);
		Route::post('/update/{id}', [ProductController::class, 'update']);
		Route::get('/status/{id}', [ProductController::class, 'status']);
		Route::get('/delete/{id}', [ProductController::class, 'delete']);
		Route::get('/restore/{id}', [ProductController::class, 'restore']);
		Route::delete('/destroy/{id}', [ProductController::class, 'destroy']);
	});
	//UC 32: Quản lý sản phẩm khuyến mãi
	Route::prefix('discount')->group(function () {
		Route::get('/', [DiscountController::class, 'index']);
		Route::get('/trash', [DiscountController::class, 'trash']);
		Route::get('/show/{id}', [DiscountController::class, 'show']);
		Route::get('/status/{id}', [DiscountController::class, 'status']);
		Route::get('/delete/{id}', [DiscountController::class, 'delete']);
		Route::get('/restore/{id}', [DiscountController::class, 'restore']);
		Route::post('/store', [DiscountController::class, 'store']);
		Route::post('/update/{id}', [DiscountController::class, 'update']);
		Route::delete('/destroy/{id}', [DiscountController::class, 'destroy']);
	});
	//UC 33: Quản lý nhập kho
	Route::prefix('productstore')->group(function () {
		Route::get('/', [ProductStoreController::class, 'index']);
		Route::get('/trash', [ProductStoreController::class, 'trash']);
		Route::get('/show/{id}', [ProductStoreController::class, 'show']);
		Route::post('/store', [ProductStoreController::class, 'store']);
		Route::post('/update/{id}', [ProductStoreController::class, 'update']);
		Route::get('/status/{id}', [ProductStoreController::class, 'status']);
		Route::get('/delete/{id}', [ProductStoreController::class, 'delete']);
		Route::get('/restore/{id}', [ProductStoreController::class, 'restore']);
		Route::delete('/destroy/{id}', [ProductStoreController::class, 'destroy']);
	});

	//UC34: Giỏ hàng
	Route::prefix('cart')->group(function () {
		Route::get('/', [ControllersCartController::class, 'index']);
		Route::get('/show/{id}', [ControllersCartController::class, 'show']);
		Route::delete('/destroy/{id}', [ControllersCartController::class, 'destroy']);
	});
	//UC35: chat
	Route::prefix('chat')->group(function () {
		Route::get('/', [ChatController::class, 'index']);
		Route::delete('/destroy/{id}', [ChatController::class, 'destroy']);
	});
	//UC36: Trò chuyện
	Route::prefix('message')->group(function () {
		Route::get('/', [MessageController::class, 'index']);
		Route::get('/show1/{chat_id}', [MessageController::class, 'show']);
		Route::get('/show/{id}', [MessageController::class, 'show1']);
		Route::delete('/destroy/{id}', [MessageController::class, 'destroy']);
	});
	//UC37: Log
	Route::prefix('log')->group(function () {
		Route::get('/', [LogController::class, 'getLogs']);
		Route::get('/show/{id}', [LogController::class, 'show']);
		Route::delete('/destroy/{id}', [LogController::class, 'destroy']);
		Route::post('/storeLog', [LogController::class, 'storeLog']);
	});
	//UC38: Tin tức
	Route::prefix('new')->group(function () {
		Route::get('/', [NewController::class, 'index']);
		Route::get('/show/{id}', [NewController::class, 'show']);
		Route::get('/status/{id}', [NewController::class, 'status']);
		Route::get('/delete/{id}', [NewController::class, 'delete']);
		Route::get('/restore/{id}', [NewController::class, 'restore']);
		Route::delete('/destroy/{id}', [NewController::class, 'destroy']);
		Route::get('/trash', [NewController::class, 'trash']);
		Route::post('/store', [NewController::class, 'store']);
		Route::post('/update/{id}', [NewController::class, 'update']);
	});


	//UC39: Danh mục tin tức
	Route::prefix('topic')->group(function () {
		Route::get('/', [NewTopicController::class, 'index']);
		Route::delete('/destroy/{id}', [NewTopicController::class, 'destroy']);
		Route::post('/store', [NewTopicController::class, 'create']);
	});
	//UC40: Bình luận tin tức
	Route::prefix('newcomment')->group(function () {
		Route::get('/', [NewCommentController::class, 'index']);
		Route::delete('/destroy/{id}', [NewCommentController::class, 'destroy']);
		Route::get('/showuser/{user_id}', [NewCommentController::class, 'showuser']);
		Route::get('/shownew/{news_id}', [NewCommentController::class, 'shownew']);
	});
	//UC41: Phản ứng tin tức
	Route::prefix('newcommentreact')->group(function () {
		Route::get('/', [NewCommentReactionController::class, 'index']);
		Route::delete('/destroy/{id}', [NewCommentReactionController::class, 'destroy']);
		Route::get('/showuser/{user_id}', [NewCommentReactionController::class, 'showuser']);
		Route::get('/showcomment/{comment_id}', [NewCommentReactionController::class, 'showcomment']);
	});
	//UC42: Thông báo
	Route::prefix('notification')->group(function () {
		Route::get('/', [NotificationController::class, 'index']);
		Route::get('/show/{id}', [NotificationController::class, 'show']);
		Route::delete('/destroy/{id}', [NotificationController::class, 'destroy']);
		Route::post('/store', [NotificationController::class, 'store']);
		Route::post('/update/{id}', [NotificationController::class, 'update']);
	});
	//UC43: Sản phẩm giảm giá
	Route::prefix('productsale')->group(function () {
		Route::get('/', [ProductSaleController::class, 'index']);
		Route::get('/show/{id}', [ProductSaleController::class, 'show']);
		Route::delete('/destroy/{id}', [ProductSaleController::class, 'destroy']);
		Route::post('/store', [ProductSaleController::class, 'store']);
		Route::post('/update/{id}', [ProductSaleController::class, 'update']);
	});
	//UC44: Thanh toán
	Route::prefix('payment')->group(function () {
		Route::get('/pending', [PaymentController::class, 'pending']);
		Route::get('/payment-stats', [PaymentController::class, 'getPaymentStats']);
		Route::delete('/destroy/{id}', [PaymentController::class, 'destroy']);
		Route::get('/completed', [PaymentController::class, 'completed']);
		Route::get('/show/{id}', [PaymentController::class, 'show']);
		Route::get('/failed', [PaymentController::class, 'failed']);
	});
	//UC45: Sản phẩm danh mục
	Route::prefix('productcat')->group(function () {
		Route::get('/', [ProductCategoryController::class, 'index']);
	});
	//UC46: Chi tiết sản phẩm
	Route::prefix('productdetail')->group(function () {
		Route::get('/', [ProductDetailController::class, 'index']);
		Route::delete('/destroy/{id}', [ProductDetailController::class, 'destroy']);
		Route::post('/store', [ProductDetailController::class, 'store']);
		Route::get('/show/{id}', [ProductDetailController::class, 'show']);
		Route::post('/update/{id}', [ProductDetailController::class, 'update']);
		Route::get('/trash', [ProductDetailController::class, 'trash']);
		Route::get('/status/{id}', [ProductDetailController::class, 'status']);
		Route::get('/delete/{id}', [ProductDetailController::class, 'delete']);
		Route::get('/restore/{id}', [ProductDetailController::class, 'restore']);
	});
	//UC47: Đánh giá
	Route::prefix('review')->group(function () {
		Route::get('/', [ReviewController::class, 'index']);
		Route::get('/show/{id}', [ReviewController::class, 'show']);
		Route::delete('/destroy/{id}', [ReviewController::class, 'destroy']);
	});
	//UC48: Địa chỉ giao hàng
	Route::prefix('address')->group(function () {
		Route::get('/', [ShippingAddressController::class, 'index']);
		Route::get('/show/{id}', [ShippingAddressController::class, 'show']);
		Route::delete('/destroy/{id}', [ShippingAddressController::class, 'destroy']);
	});
	//UC49: Danh sách ưu thich
	Route::prefix('wishlist')->group(function () {
		Route::get('/', [WishlistController::class, 'index']);
		Route::get('/show/{id}', [WishlistController::class, 'show']);
		Route::delete('/destroy/{id}', [WishlistController::class, 'destroy']);
	});
	//UC50: Người dùng giảm giá
	Route::prefix('user-discount')->group(function () {
		Route::get('/', [UserDiscountController::class, 'index']);
		Route::post('/store', [UserDiscountController::class, 'store']);
		Route::delete('/destroy/{id}', [UserDiscountController::class, 'destroy']);
	});
	// UC: Lấy top 5 sản phẩm được đặt hàng nhiều nhất
	Route::get('/most-ordered-product', [OrderController::class, 'mostOrderedProduct']);

	// UC: Lấy top 5 sản phẩm có doanh thu cao nhất
	Route::get('/top-revenue-products', [OrderController::class, 'topRevenueProducts']);

	// UC: Lấy tổng số đơn hàng
	Route::get('/dashboard/total-orders', [OrderController::class, 'totalOrders']);

	// UC: Lấy tổng số người dùng
	Route::get('/dashboard/total-users', [UserController::class, 'totalUser']);

	// UC: Lấy tổng số sản phẩm còn trong kho
	Route::get('/dashboard/total-products-in-stock', [ProductStoreController::class, 'totalProductsInStock']);

	// UC: Lấy tổng số sản phẩm đã bán
	Route::get('/dashboard/total-products-sold', [OrderController::class, 'totalProductsSold']);
});
// Route::get('admin/forget', [UserController::class, 'getforget']);
// Route::post('admin/forget', [UserController::class, 'postforget']);
// //UC 21: Cập nhật cấu hình
// Route::get('config', [ConfigController::class, 'index']);
// Route::post('config/update/{id}', [ConfigController::class, 'update']);
