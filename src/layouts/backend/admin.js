import React, { useState, useEffect } from "react";
import { FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../services/Userservice";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Logservice from "../../services/Logservice";

const AdminMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const urlImage = "http://127.0.0.1:8000/images/";
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await UserService.logout();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Lấy nhật ký
  const fetchAllLogs = async () => {
    try {
      const result = await Logservice.index();
      setLogs(result?.data || []);
      console.log(result);
      if (result.data.length === 0) {
        toast.info("Chưa có nhật ký nào.");
      }
    } catch (error) {
      console.error("Lỗi khi tải nhật ký:", error);
    }
  };

  // Fetch nhật ký khi mở menu
  useEffect(() => {
    if (isLogOpen) {
      fetchAllLogs(); // Lấy nhật ký khi mở
    }
  }, [isLogOpen, page]);

  let userImage = user.image;
  if (typeof userImage === "string") {
    userImage = JSON.parse(userImage); // Chuyển chuỗi JSON thành mảng
  }

  return (
    <div className="relative flex items-center space-x-4">
      {/* Nút Nhật ký */}
      <div className="relative">
        <button
          onClick={() => setIsLogOpen(!isLogOpen)}
          className="text-black hover:text-blue-600 rounded-lg p-4 bg-white focus:outline-none"
        >
          <FaBell className="text-2xl text-orange-500" />
        </button>
        {isLogOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
            <div className="p-4 border-b font-semibold text-gray-700">
              Nhật ký
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {logs.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 cursor-pointer"
                >
                  Hành động: {item.action} / Bảng: {item.table_name}
                </li>
              ))}
            </ul>
            <div className="px-4 py-2 text-sm text-blue-500 hover:underline cursor-pointer">
              <Link to="/admin/log">Xem tất cả</Link>
            </div>
          </div>
        )}
      </div>

      {/* Avatar + Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
        >
          <img
            src={urlImage + "user/" + userImage}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold text-black">{user?.name}</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            <Link
              to={`/admin/user/show/${user.id}`}
              className="flex items-center px-4 py-2 text-black hover:bg-gray-100"
            >
              <FaUser className="mr-2" />
              Thông tin cá nhân
            </Link>
            <button
              className="flex items-center px-4 py-2 text-black hover:bg-gray-100 w-full"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
