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
  FaChevronDown,
  FaList,
  FaTag,
  FaInfoCircle,
  FaTrademark,
  FaFolder,
  FaCreditCard,
  FaTruck,
  FaUser,
  FaHeart,
  FaFileAlt,
  FaComment,
  FaImage,
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
      className={`bg-gray-900 rounded-br-2xl rounded-bl-2xl text-white p-5 h-screen transition-all duration-300 ${
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
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  openMenu === "products" ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {openMenu === "products" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link
                  to="/admin/product"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaList />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Danh sách sản phẩm
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/productsale"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaTag />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Danh sách sản phẩm giảm giá
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/productdetail"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaInfoCircle />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Danh sách chi tiết sản phẩm
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/brand"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaTrademark />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Thương hiệu
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/category"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaFolder />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Danh mục
                  </span>
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
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  openMenu === "orders" ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {openMenu === "orders" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link
                  to="/admin/order"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaList />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Danh sách đơn hàng
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/payment"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaCreditCard />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Thanh toán
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/address"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaTruck />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Giao hàng
                  </span>
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
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  openMenu === "customers" ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {openMenu === "customers" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link
                  to="/admin/user"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaUser />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Người dùng
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/wishlist"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaHeart />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Danh sách yêu thích
                  </span>
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
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  openMenu === "news" ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {openMenu === "news" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link
                  to="/admin/new"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaFileAlt />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Bài viết
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/topic"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaFolder />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Chủ Đề
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/newcomment"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaComment />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Bình luận
                  </span>
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
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  openMenu === "settings" ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {openMenu === "settings" && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link
                  to="/admin/banner"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaImage />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Quản lý banner
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/menu"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaBars />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Quản lý menu
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/log"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaFileAlt />
                  <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
                    Nhật ký hệ thống
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Quản lý đánh giá */}
        <li className="flex items-center space-x-2 w-full text-left">
          <FaStar />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/review" className="hover:text-gray-300">
              Đánh giá
            </Link>
          </span>
        </li>

        {/* Quản lý giỏ hàng */}
        <li className="flex items-center space-x-2 w-full text-left">
          <FaShoppingCart />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/cart" className="hover:text-gray-300">
              Giỏ hàng
            </Link>
          </span>
        </li>

        {/* Quản lý thông báo */}
        <li className="flex items-center space-x-2 w-full text-left">
          <FaBell />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/notification" className="hover:text-gray-300">
              Thông báo
            </Link>
          </span>
        </li>

        {/* Quản lý phiếu giảm giá */}
        <li className="flex items-center space-x-2 w-full text-left">
          <IoTicketOutline />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/discount" className="hover:text-gray-300">
              Phiếu giảm giá
            </Link>
          </span>
        </li>
        <li className="flex items-center space-x-2 w-full text-left">
          <IoTicketOutline />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <Link to="/admin/userdiscount" className="hover:text-gray-300">
              Phiếu giảm giá người dùng
            </Link>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
