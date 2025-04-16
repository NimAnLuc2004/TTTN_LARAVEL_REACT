import React, { useState } from "react";
import {
  FaBars,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaNewspaper,
  FaCogs,
  FaPhone,
  FaStore,
  FaStar,
  FaBell,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoTicketOutline } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div
      className={`bg-gray-900 rounded-2xl text-white p-5 h-screen transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex justify-between items-center">
        <a
          href="/admin"
          className={`text-xl font-bold transition-all duration-300 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          Dashboard
        </a>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white text-2xl"
        >
          <FaBars />
        </button>
      </div>

      <ul className="mt-5 space-y-4">
        {/* Quản lý sản phẩm */}
        <li>
          <button
            onClick={() => toggleMenu("products")}
            className="flex items-center space-x-2 w-full text-left"
          >
            <FaBox />
            <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
              Sản phẩm
            </span>
          </button>
          {openMenu === "products" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link to="/admin/product" className="hover:text-gray-300">
                  Danh sách sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/admin/productsale" className="hover:text-gray-300">
                  Danh sách sản phẩm giảm giá
                </Link>
              </li>
              <li>
                <Link to="/admin/productdetail" className="hover:text-gray-300">
                  Danh sách chi tiết sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/admin/brand" className="hover:text-gray-300">
                  Thương hiệu
                </Link>
              </li>
              <li>
                <Link to="/admin/category" className="hover:text-gray-300">
                  Danh mục
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Quản lý đơn hàng */}
        <li>
          <button
            onClick={() => toggleMenu("orders")}
            className="flex items-center space-x-2 w-full text-left"
          >
            <FaShoppingCart />
            <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
              Đơn hàng
            </span>
          </button>
          {openMenu === "orders" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link to="/admin/order" className="hover:text-gray-300">
                  Danh sách đơn hàng
                </Link>
              </li>
              <li>
                <Link to="/admin/payment" className="hover:text-gray-300">
                  Thanh toán
                </Link>
              </li>
              <li>
                <Link to="/admin/address" className="hover:text-gray-300">
                  Giao hàng
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Quản lý khách hàng */}
        <li>
          <button
            onClick={() => toggleMenu("customers")}
            className="flex items-center space-x-2 w-full text-left"
          >
            <FaUsers />
            <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
              Khách hàng
            </span>
          </button>
          {openMenu === "customers" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link to="/admin/user" className="hover:text-gray-300">
                  Người dùng
                </Link>
              </li>
              <li>
                <Link to="/admin/wishlist" className="hover:text-gray-300">
                  Danh sách yêu thích
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Quản lý tin tức */}
        <li>
          <button
            onClick={() => toggleMenu("news")}
            className="flex items-center space-x-2 w-full text-left"
          >
            <FaNewspaper />
            <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
              Tin tức
            </span>
          </button>
          {openMenu === "news" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link to="/admin/new" className="hover:text-gray-300">
                  Bài viết
                </Link>
              </li>
              <li>
                <Link to="/admin/newcomment" className="hover:text-gray-300">
                  Bình luận
                </Link>
              </li>
            </ul>
          )}
        </li>
        {/* Quản lý liên hệ */}
        <li className="flex items-center space-x-2 w-full text-left">
          <FaPhone />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/contact" className="hover:text-gray-300">
              Liên hệ
            </Link>
          </span>
        </li>
         {/* Quản lý message */}
         <li className="flex items-center space-x-2 w-full text-left">
         <FaMessage />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/message" className="hover:text-gray-300">
              Message
            </Link>
          </span>
        </li>
        {/* Quản lý nhập hàng */}
        <li className="flex items-center space-x-2 w-full text-left">
          <FaStore />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
          <Link to="/admin/productstore/add" className="hover:text-gray-300">
          Nhập Hàng
            </Link>
          </span>
        </li>
        {/* Cấu hình */}
        <li>
          <button
            onClick={() => toggleMenu("settings")}
            className="flex items-center space-x-2 w-full text-left"
          >
            <FaCogs />
            <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
              Cấu hình
            </span>
          </button>
          {openMenu === "settings" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link to="/admin/banner" className="hover:text-gray-300">
                  Quản lý banner
                </Link>
              </li>
              <li>
                <Link to="/admin/menu" className="hover:text-gray-300">
                  Quản lý menu
                </Link>
              </li>
              <li>
                <Link to="/admin/log" className="hover:text-gray-300">
                  Nhật ký hệ thống
                </Link>
              </li>
            </ul>
          )}
        </li>
           {/* Quản lý đánh giá */}
           <li className="flex items-center space-x-2 w-full text-left">
          <FaStar />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/review" className="hover:text-gray-300">Đánh giá</Link>
          </span>
        </li>

        {/* Quản lý giỏ hàng */}
        <li className="flex items-center space-x-2 w-full text-left">
          <FaShoppingCart />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/cart" className="hover:text-gray-300">Giỏ hàng</Link>
          </span>
        </li>

        {/* Quản lý thông báo */}
        <li className="flex items-center space-x-2 w-full text-left">
          <FaBell />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/notification" className="hover:text-gray-300">Thông báo</Link>
          </span>
        </li>
        <li className="flex items-center space-x-2 w-full text-left">
        <IoTicketOutline />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/discount" className="hover:text-gray-300">Phiếu giảm giá</Link>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
