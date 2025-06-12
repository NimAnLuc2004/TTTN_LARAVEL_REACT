import React, { useEffect, useState } from "react";
import UserService from "../../../services/Userservice"; // Dịch vụ cho người dùng
import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserTrashList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTrashUsers = async () => {
      try {
        const result = await UserService.trash(); // Lấy danh sách người dùng trong thùng rác
        setUsers(result.users);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng trong thùng rác:", error);
        toast.error("Không thể tải danh sách người dùng trong thùng rác!");
      }
    };

    fetchTrashUsers(); // Gọi hàm lấy dữ liệu khi component mount
  }, []);

  const handleRestore = async (id) => {
    try {
      await UserService.restore(id); // Khôi phục người dùng
      setUsers(users.filter((user) => user.id !== id)); // Cập nhật state để loại bỏ người dùng đã được khôi phục
      toast.success("Người dùng đã được khôi phục!");

    } catch (error) {
      console.error("Lỗi khi phục hồi người dùng:", error);
      toast.error("Không thể khôi phục người dùng!");
    }
  };

  const handleDeletePermanently = async (id) => {
    try {
      await UserService.destroy(id); // Xóa vĩnh viễn người dùng
      setUsers(users.filter((user) => user.id !== id)); // Cập nhật state để loại bỏ người dùng đã xóa
      toast.success("Người dùng đã bị xóa vĩnh viễn!");
    } catch (error) {
      console.error("Lỗi khi xóa vĩnh viễn người dùng:", error);
      toast.error("Không thể xóa vĩnh viễn người dùng!");
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">
          Home / Quản lý Người dùng / Thùng rác
        </p>
      </div>

      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Danh sách Người dùng trong Thùng rác
        </h2>
        <Link
          to="/admin/user"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4">#</th>
              <th className="p-4">Tên Người dùng</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-4 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRestore(user.id)}
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrashRestore className="inline" /> Khôi phục
                    </button>
                    <button
                      onClick={() => handleDeletePermanently(user.id)}
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrash className="inline" /> Xóa vĩnh viễn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  Không có người dùng nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserTrashList;
