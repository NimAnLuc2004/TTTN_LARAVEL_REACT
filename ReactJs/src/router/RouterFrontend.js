import Search from "../layouts/frontend/Search";
import Cart from "../pages/frontend/Cart/Cart";
import Contact from "../pages/frontend/Contact/Contact";
import Home from "../pages/frontend/home/index";
import NewsDetail from "../pages/frontend/New/NewDetail";
import News from "../pages/frontend/New/News";
import Order from "../pages/frontend/Order/Order";
import TrackOrder from "../pages/frontend/Order/TrackOrder";

import AboutUs from "../pages/frontend/Page/AboutUs";
import PrivacyPolicy from "../pages/frontend/Page/PrivacyPolicy";
import ReturnPolicy from "../pages/frontend/Page/ReturnPolicy";
import ShippingPolicy from "../pages/frontend/Page/ShippingPolicy";
import WarrantyPolicy from "../pages/frontend/Page/WarrantyPolicy";
import ProductDetail from "../pages/frontend/Product/ProductDetail.";
import ProductFilterPage from "../pages/frontend/Product/ProductFilterPage";

import Login from "../pages/frontend/User/Login";
import Signup from "../pages/frontend/User/Signup";
import UserProfile from "../pages/frontend/User/UserProfile";
import Wishlist from "../pages/frontend/WishList/Wishlist";

const RouterFrontend = [
  { path: "/", element: <Home /> },
  { path: "/product/all", element: <ProductFilterPage /> },
  { path: "/product/:id", element: <ProductDetail /> },
  { path: "/shipping-policy", element: <ShippingPolicy /> },
  { path: "/return-policy", element: <ReturnPolicy /> },
  { path: "/warranty-policy", element: <WarrantyPolicy /> },
  { path: "/about-us", element: <AboutUs /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/wishlist", element: <Wishlist /> },
  { path: "/news", element: <News /> },
  { path: "/news/detail/:id", element: <NewsDetail /> },
  { path: "/search", element: <Search /> },
  { path: "/login", element: <Login /> },
  { path: "/contact", element: <Contact /> },
  { path: "/cart", element: <Cart /> },
  { path: "/register", element: <Signup /> },
  { path: "/profile", element: <UserProfile /> },
  { path: "/order/checkout", element: <Order /> },
  { path: "/track-order", element: <TrackOrder /> },
];
export default RouterFrontend;
