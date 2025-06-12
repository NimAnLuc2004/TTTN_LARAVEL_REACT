import React, { useState, useEffect } from "react";
import { FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../services/Userservice";
import NotificationService from "../../services/Notificationservice "; // Import NotificationService
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const AdminMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Renamed from isLogOpen
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState([]); // Renamed from logs
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const urlImage = "https://zstore.click/images/";
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await UserService.logout();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Đăng xuất thành công!");
      setTimeout(() => {
        navigate("/admin/login");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Fetch notifications
  const fetchAllNotifications = async () => {
    try {
      const result = await NotificationService.index();
      setNotifications(result?.noti?.data || []);
      setLastPage(result?.noti?.last_page || 1);
      if (result.noti.data.length === 0) {
        toast.info("Chưa có thông báo nào.");
      }
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    }
  };

  // Fetch notifications when menu is opened
  useEffect(() => {
    if (isNotificationOpen) {
      fetchAllNotifications(); // Fetch notifications when opened
    }
  }, [isNotificationOpen, page]);

  let userImage =
    Array.isArray(user?.image) && user.image.length > 0
      ? user.image[0]
      : "default.jpg";

  return (
    <div className="relative flex items-center space-x-4">
      {/* Notification Button */}
      <div className="relative">
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className="text-black hover:text-blue-600 rounded-lg p-4 bg-white focus:outline-none"
        >
          <FaBell className="text-2xl text-orange-500" />
        </button>
        {isNotificationOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
            <div className="p-4 border-b font-semibold text-gray-700">
              Thông báo
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {notifications.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 cursor-pointer"
                >
                  {item.message}
                </li>
              ))}
            </ul>
            <div className="px-4 py-2 text-sm text-blue-500 hover:underline cursor-pointer">
              <Link to="/admin/notification">Xem tất cả</Link>
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
