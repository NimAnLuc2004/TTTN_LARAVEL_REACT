import React, { useState, useEffect } from "react";
import Notificationservice from "../../../services/Notificationservice ";
import UserService from "../../../services/Userservice";
import { IoEyeSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const NotificationAdd = () => {
  const [userId, setUserId] = useState(null); // ID người dùng được chọn
  const [userList, setUserList] = useState([]); // Danh sách người dùng
  const [notifications, setNotification] = useState([]);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("user"); // State for role, default to 'user'
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  // Pagination
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // Lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      const result = await UserService.index();
      setUserList(result?.users || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  // Lấy danh sách thông báo từ API
  const fetchAllNotifications = async () => {
    try {
      const result = await Notificationservice.index(page);
      setNotification(result?.noti.data || []);
      setLastPage(result.noti.last_page);

      if (result.noti.length === 0) {
        toast.info("Chưa có thông báo nào.");
      }
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllNotifications();
  }, [page]);

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredNotifications.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    const name = item.user_id ? item.user_id.toString() : "";
    return removeVietnameseTones(name.toLowerCase()).includes(
      removeVietnameseTones(searchTerm.toLowerCase())
    );
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info("Vui lòng chọn ít nhất một mục để xóa.");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các thông báo đã chọn?")) {
      try {
        await Promise.all(
          selectedIds.map((id) => Notificationservice.destroy(id))
        );
        setNotification((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );
        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách thông báo thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };

  // Xử lý thêm thông báo
  const handleAddNotification = async () => {
    if (!userId || !message || !role) {
      toast.error("Vui lòng chọn người dùng, nhập nội dung thông báo và chọn quyền.");
      return;
    }

    const notificationData = {
      user_id: userId,
      message: message,
      role: role, // Include role in the data sent to backend
    };

    try {
      const result = await Notificationservice.insert(notificationData);

      if (result.status) {
        toast.success("Thêm thông báo thành công!");
        setNotification([...notifications, result.noti]);
        setMessage("");
        setUserId(null);
        setRole("user"); // Reset role to default
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm thông báo:", error);
      toast.error("Lỗi kết nối với máy chủ.");
    }
  };

  // Xử lý xóa thông báo
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      try {
        await Notificationservice.destroy(id);
        setNotification(notifications.filter((noti) => noti.id !== id));
        toast.success("Xóa thông báo thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa thông báo:", error);
        toast.error("Lỗi khi xóa thông báo.");
      }
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý thông báo</p>
      </div>
      {/* Search and Delete */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo Id người dùng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="border border-gray-300 px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white py-1 px-3 rounded-md"
        >
          <MdDelete className="inline" /> Xóa đã chọn
        </button>
      </div>
      <div className="flex flex-row bg-gray-100">
        <div className="basis-4/12 bg-white shadow-md rounded-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Thêm Thông Báo
          </h1>
          <form className="grid gap-4">
            {/* Chọn người dùng */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Người dùng
              </label>
              <select
                className="w-full p-2 border rounded"
                value={userId || ""}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Chọn người dùng</option>
                {userList.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} (ID: {user.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn quyền */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Quyền
              </label>
              <select
                className="w-full p-2 border rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Nhập nội dung thông báo */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nội dung thông báo
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none"
                id="message"
                placeholder="Nhập nội dung thông báo"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Nút Thêm Thông Báo */}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={handleAddNotification}
            >
              Thêm Thông Báo
            </button>
          </form>
        </div>

        {/* Bảng hiển thị thông báo */}
        <div className="basis-8/12 px-8">
          <table className="w-full bg-white shadow-md rounded-md table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-4 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredNotifications.length > 0 &&
                      selectedIds.length === filteredNotifications.length
                    }
                  />
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  Id{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("user_id")}
                >
                  Id người dùng{" "}
                  {sortConfig.key === "user_id" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Quyền{" "}
                  {sortConfig.key === "role" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4">Nội dung</th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedNotifications.length > 0 ? (
                sortedNotifications.map((noti) => (
                  <tr key={noti.id} className="border-b">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(noti.id)}
                        onChange={() => handleCheckboxChange(noti.id)}
                      />
                    </td>
                    <td className="p-4">{noti.id}</td>
                    <td className="p-4">{noti.user_id}</td>
                    <td className="p-4">{noti.role}</td>
                    <td className="p-4">
                      {noti.message.length > 50
                        ? noti.message.substring(0, 50) + "..."
                        : noti.message}
                    </td>
                    <td className="p-4">
                      <Link to={`/admin/notification/show/${noti.id}`}>
                        <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                          <IoEyeSharp className="inline" /> Xem
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(noti.id)}
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <MdDelete className="inline" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6" // Updated colSpan to account for new 'role' column
                    className="p-4 text-center text-red-500 font-bold"
                  >
                    Hiện tại không có thông báo nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setSearchParams({ page: page - 1 })}
              disabled={page <= 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Trước
            </button>
            <span>
              {page} / {lastPage}
            </span>
            <button
              onClick={() => setSearchParams({ page: page + 1 })}
              disabled={page >= lastPage}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationAdd;