<?php

use App\Http\Controllers\Api\ApiController;
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
use App\Http\Controllers\frontend\MenuController as FrontendMenuController;
use App\Http\Controllers\frontend\PostController as FrontendPostController;
use App\Http\Controllers\frontend\ProductController as FrontendProductController;
use App\Http\Controllers\frontend\UserController as FrontendUserController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NewCategoryController;
use App\Http\Controllers\NewCommentController;
use App\Http\Controllers\NewCommentReactionController;
use App\Http\Controllers\NewController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ProductSaleController;
use App\Http\Controllers\ProductStoreController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingAddressController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WishlistController;
use App\Models\ProductCategory;

// Route::get('/user', function (Request $request) {
// 	return $request->user();
// })->middleware('auth:sanctum');


// //Route::get('menu_list/{position}/{parentid?}/{limit?}', [MenuController::class, 'menu_list']);
// Route::get('menu_list/{parentid?}/{limit?}', [FrontendMenuController::class, 'menu_list']);
// Route::get('menu_footer', [FrontendMenuController::class, 'menu_footer']);
// //UC3: Slideshow (slider_ list/vị trí/giới hạn)
// //Route::get('slider_list/{position}/{limit?}', [BannerController::class, 'slider_list']);
// //tat ca san pham
// Route::get('product', [FrontendProductController::class, 'productall']);
// //UC4: Sản phẩm mới (product_new/ giới hạn)
// Route::get('product_new/{limit}', [FrontendProductController::class, 'product_new']);
// //UC5: Sản phẩm khuyến mãi (product_sale/giới hạn)
// Route::get('product_sale/{limit}', [FrontendProductController::class, 'product_sale']);
// // UC6: Sản phẩm bán chạy (product_bestseller/giới hạn)
// Route::get('product_bestseller/{limit}', [FrontendProductController::class, 'product_bestseller']);
// // UC7-1: Danh mục (category_list/cấp)
// //Route::get('category_list/{parentid?}', [CategoryController::class, 'category_list']);
// // UC7-2: Sản phẩm theo danh mục (product_category/mã danh mục/giới hạn)
// //Route::get('product_category/categoryid/{limit}', [ProductController::class, 'product_category']);
// // UC8: Bài viết mới nhất (post_new/giới hạn)
// Route::get('post_new/{limit}', [FrontendPostController::class, 'post_new']);
// // UC9: Trang đơn (post_page/slug)
// Route::get('post_page/{slug}', [FrontendPostController::class, 'post_page']);
// //UC10: Sản phẩm (product_all/mã danh mục/giới hạn)
// //Route::get('product_all/{categoryid}/{limit}', [ProductController::class, 'product_all']);
// //UC11: Chi tiết sản phẩm (product_detail/slug/giới hạn)
// Route::get('product_detail/{slug}/{limit}', [FrontendProductController::class, 'product_detail']);
// //UC12: Bài viết (post_all/mã chủ đề/giới hạn)
// Route::get('post_all/{topicid}/{limit}', [FrontendPostController::class, 'post_all']);
// //UC13: Chi tiết bài viết (post_detail/slug/giới hạn)
// Route::get('post_detail/{slug}/{limit}', [FrontendPostController::class, 'post_detail']);
// //UC14: Liên hệ (contact/store)



// //UC15: Đăng ký (customer/register)
// Route::post('customer/register', [FrontendUserController::class, 'customer_register']);
// //UC16: Đăng nhập (customer/login)
// Route::post('customer/login', [FrontendUserController::class, 'loginuser']);
// //UC17: Thông tin tài khoản (customer/profile/mã tài khoản)
// Route::get('customer/profile/{id}', [UserController::class, 'customer_profile']);
// //UC18: Lịch sử mua hàng (customer/cart/mã tài khoản)
// Route::get('customer/cart/{id}', [UserController::class, 'customer_cart']);
// //UC19: Thanh toán (customer/checkout/mã tài khoản)
// Route::get('customer/checkout/{id}', [UserController::class, 'customer_checkout']);

// // Route cho trang quản lý
// //UC20: Đăng nhập và quên mật khẩu
Route::post('admin/login', [UserController::class, 'login']);

Route::group(["middleware"=>["auth:sanctum"]],function(){
	Route::get("admin/profile",[UserController::class,"profile"]);
	Route::get("admin/logout",[UserController::class,"logout"]);
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
		Route::post('/reply/{id}', [ContactController::class, 'reply']);
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
	Route::prefix('newcat')->group(function () {
		Route::get('/', [NewCategoryController::class, 'index']);
		Route::delete('/destroy/{id}', [NewCategoryController::class, 'destroy']);
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
	//top 5 sản phẩm được đặt hàng nhiều nhất
	Route::get('/most-ordered-product', [OrderController::class, 'mostOrderedProduct']);
	//top 5 sản phẩm có doanh thu cao nhất
	Route::get('/top-revenue-products', [OrderController::class, 'topRevenueProducts']);
	//tong don hang
	Route::get('/dashboard/total-orders', [OrderController::class, 'totalOrders']);
	//tong user
	Route::get('/dashboard/total-users', [UserController::class, 'totalUser']);
	//san pham con ton kho
	Route::get('/dashboard/total-products-in-stock', [ProductStoreController::class, 'totalProductsInStock']);
	//tong so cac san pham ban ra
	Route::get('/dashboard/total-products-sold', [OrderController::class, 'totalProductsSold']);
});
// Route::get('admin/forget', [UserController::class, 'getforget']);
// Route::post('admin/forget', [UserController::class, 'postforget']);
// //UC 21: Cập nhật cấu hình
// Route::get('config', [ConfigController::class, 'index']);
// Route::post('config/update/{id}', [ConfigController::class, 'update']);

