import BannerList from "../pages/backend/Banner";
import ProductList from "../pages/backend/Product";
import Dashboard from "../pages/backend/Dashboard";
import UserList from "../pages/backend/User";
import BrandList from "../pages/backend/Brand";
import CategoryList from "../pages/backend/Category";
import ContactList from "../pages/backend/contact";
import MenuList from "../pages/backend/Menu";
import OrderList from "../pages/backend/Order";
import Productadd from "../pages/backend/Product/add";
import Banneradd from "../pages/backend/Banner/add";
import BrandAdd from "../pages/backend/Brand/add";
import CategoryAdd from "../pages/backend/Category/add";
import MenuAdd from "../pages/backend/Menu/add";

import UserAdd from "../pages/backend/User/add";

import ProductImportAdd from "../pages/backend/ProductStore/add";
import ShowBanner from "../pages/backend/Banner/show";
import TrashBannerList from "../pages/backend/Banner/trash";
import ShowBrand from "../pages/backend/Brand/show";
import TrashBrandList from "../pages/backend/Brand/trash";
import ShowCategory from "../pages/backend/Category/show";
import TrashCategoryList from "../pages/backend/Category/trash";
import ProductShow from "../pages/backend/Product/show";
import ProductTrash from "../pages/backend/Product/trash";
import UserTrashList from "../pages/backend/User/trash";
import ShowUser from "../pages/backend/User/show";

import BannerEdit from "../pages/backend/Banner/edit";
import ProductEdit from "../pages/backend/Product/edit";

import BrandEdit from "../pages/backend/Brand/edit";
import CategoryEdit from "../pages/backend/Category/edit";

import UserEdit from "../pages/backend/User/edit";
import MenuEdit from "../pages/backend/Menu/edit";
import ContactShow from "../pages/backend/contact/show";
import ShowMenu from "../pages/backend/Menu/show";
import MenuTrashList from "../pages/backend/Menu/trash";
import ShowProductStore from "../pages/backend/ProductStore/show";
import TrashStore from "../pages/backend/ProductStore/trash";
import OrderDetail from "../pages/backend/Order/show";
import OrderTrash from "../pages/backend/Order/trash";
import OrderEdit from "../pages/backend/Order/edit";
import ContactTrash from "../pages/backend/contact/trash";
import ContactEdit from "../pages/backend/contact/edit";
import ProductDetailAdd from "../pages/backend/ProductDetail/add";
import ProductDetailList from "../pages/backend/ProductDetail";
import ProductDetailEdit from "../pages/backend/ProductDetail/edit";
import LogList from "../pages/backend/Log";
import PaymentList from "../pages/backend/Payment";
import WishListList from "../pages/backend/Wishlist";

import ReviewList from "../pages/backend/Review";
import CartList from "../pages/backend/Cart";
import ShowCart from "../pages/backend/Cart/show";
import ShowReview from "../pages/backend/Review/show";
import ShowNotification from "../pages/backend/Notification/show";
import NotificationAdd from "../pages/backend/Notification";

import ShowDiscount from "../pages/backend/Discount/show";
import DiscountList from "../pages/backend/Discount";
import DiscountAdd from "../pages/backend/Discount/add";
import DiscountEdit from "../pages/backend/Discount/edit";
import TrashDiscountList from "../pages/backend/Discount/trash";
import LogDetail from "../pages/backend/Log/show";
import ProductSaleAdd from "../pages/backend/ProductSale";
import ShowProductSale from "../pages/backend/ProductSale/show";
import NewList from "../pages/backend/New";
import NewAdd from "../pages/backend/New/add";
import ShowNew from "../pages/backend/New/show";
import NewEdit from "../pages/backend/New/edit";
import NewTrash from "../pages/backend/New/trash";
import ShowWishlist from "../pages/backend/Wishlist/show";
import PaymentDetail from "../pages/backend/Payment/show";
import ProductdetailShow from "../pages/backend/ProductDetail/show";
import AddressAdd from "../pages/backend/Address";
import ShowAdress from "../pages/backend/Address/show";
import MessageList from "../pages/backend/Message";
import ShowMessage from "../pages/backend/Message/show";
import  ShowNewCommentNew from "../pages/backend/NewComment/shownew";
import ShowNewCommentUser from "../pages/backend/NewComment/showuser";
import NewCommentList from "../pages/backend/NewComment";



const RouterBackend = [
  //admin
  { path: "/admin", element: <Dashboard /> },
  //address
  { path: "/admin/address", element: <AddressAdd /> },
  { path: "/admin/address/show/:id", element: <ShowAdress /> },
  //banner
  { path: "/admin/banner", element: <BannerList /> },
  { path: "/admin/banner/show/:id", element: <ShowBanner /> },
  { path: "/admin/banner/trash", element: <TrashBannerList /> },
  { path: "/admin/banner/add", element: <Banneradd /> },
  { path: "/admin/banner/edit/:id", element: <BannerEdit /> },
  //product
  { path: "/admin/product/add", element: <Productadd /> },
  { path: "/admin/product/show/:id", element: <ProductShow /> },
  { path: "/admin/product/edit/:id", element: <ProductEdit /> },
  { path: "/admin/product/trash", element: <ProductTrash /> },
  { path: "/admin/product", element: <ProductList /> },
  //new
  { path: "/admin/new", element: <NewList /> },
  { path: "/admin/new/add", element: <NewAdd /> },
  { path: "/admin/new/show/:id", element: <ShowNew /> },
  { path: "/admin/new/edit/:id", element: <NewEdit /> },
  { path: "/admin/new/trash", element: <NewTrash /> },
  //newcomment
  { path: "/admin/newcomment", element: <NewCommentList /> },
  { path: "/admin/newcomment/showuser/:id", element: <ShowNewCommentUser /> },
  { path: "/admin/newcomment/shownew/:id", element: <ShowNewCommentNew /> },
  //wishlist
  { path: "/admin/wishlist", element: <WishListList /> },
  
  { path: "/admin/wishlist/show/:id", element: <ShowWishlist /> },
  //thông báo
  { path: "/admin/notification", element: <NotificationAdd /> },
  { path: "/admin/notification/show/:id", element: <ShowNotification /> },

  //review
  { path: "/admin/review", element: <ReviewList /> },
  { path: "/admin/review/show/:id", element: <ShowReview /> },
  //message
  { path: "/admin/message", element: <MessageList /> },
  { path: "/admin/message/show/:id", element: <ShowMessage /> },
  //cart
  { path: "/admin/cart", element: <CartList /> },
  { path: "/admin/cart/show/:id", element: <ShowCart /> },
  //payment
  { path: "/admin/payment", element: <PaymentList /> },
  { path: "/admin/payment/show/:id", element: <PaymentDetail /> },
  //log
  { path: "/admin/log", element: <LogList /> },
  { path: "/admin/log/show/:id", element: <LogDetail /> },
  //discount
  { path: "/admin/discount", element: <DiscountList /> },
  { path: "/admin/discount/show/:id", element: <ShowDiscount /> },
  { path: "/admin/discount/add", element: <DiscountAdd /> },
  { path: "/admin/discount/edit/:id", element: <DiscountEdit /> },
  { path: "/admin/discount/trash", element: <TrashDiscountList /> },
  //productsale
  { path: "/admin/productsale", element: <ProductSaleAdd /> },
  { path: "/admin/productsale/show/:id", element: <ShowProductSale /> },
  //detail
  { path: "/admin/productdetail/show/:id", element: <ProductdetailShow /> },
  { path: "/admin/productdetail/edit/:id", element: <ProductDetailEdit /> },
  { path: "/admin/productdetail", element: <ProductDetailList /> },
  { path: "/admin/productdetail/add", element: <ProductDetailAdd /> },
  //store
  { path: "/admin/productstore/add", element: <ProductImportAdd /> },
  { path: "/admin/productstore/show/:id", element: <ShowProductStore /> },
  { path: "/admin/productstore/trash", element: <TrashStore /> },

  //brand
  { path: "/admin/brand/add", element: <BrandAdd /> },
  { path: "/admin/brand/show/:id", element: <ShowBrand /> },
  { path: "/admin/brand/trash", element: <TrashBrandList /> },
  { path: "/admin/brand", element: <BrandList /> },
  { path: "/admin/brand/edit/:id", element: <BrandEdit /> },
  //category
  { path: "/admin/category/show/:id", element: <ShowCategory /> },
  { path: "/admin/category/trash", element: <TrashCategoryList /> },
  { path: "/admin/category/add", element: <CategoryAdd /> },
  { path: "/admin/category", element: <CategoryList /> },
  { path: "/admin/category/edit/:id", element: <CategoryEdit /> },
  //menu
  { path: "/admin/menu/add", element: <MenuAdd /> },
  { path: "/admin/menu", element: <MenuList /> },
  { path: "/admin/menu/edit/:id", element: <MenuEdit /> },
  { path: "/admin/menu/show/:id", element: <ShowMenu /> },
  { path: "/admin/menu/trash", element: <MenuTrashList /> },
  //user
  { path: "/admin/user/add", element: <UserAdd /> },
  { path: "/admin/user", element: <UserList /> },
  { path: "/admin/user/show/:id", element: <ShowUser /> },
  { path: "/admin/user/trash", element: <UserTrashList /> },
  { path: "/admin/user/edit/:id", element: <UserEdit /> },
  //contact
  { path: "/admin/contact", element: <ContactList /> },
  { path: "/admin/contact/show/:id", element: <ContactShow /> },
  { path: "/admin/contact/trash", element: <ContactTrash /> },
  { path: "/admin/contact/edit/:id", element: <ContactEdit /> },
  //order
  { path: "/admin/order", element: <OrderList /> },
  { path: "/admin/order/show/:id", element: <OrderDetail /> },
  { path: "/admin/order/trash", element: <OrderTrash /> },
  { path: "/admin/order/edit/:id", element: <OrderEdit /> },
];
export default RouterBackend;
