import React, { useEffect, useState } from "react";
import UserService from "../../../services/Userservice";
import { IoEyeSharp } from "react-icons/io5";
import {
  FaToggleOff,
  FaToggleOn,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const urlImage = "http://127.0.0.1:8000/images/";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  //phân trang
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  useEffect(() => {
    (async () => {
      try {
        const result = await UserService.index(page);
        setUsers(result.users.data ?? []);
        setLastPage(result.users.last_page);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thành viên:", error);
        setError("Không thể tải danh sách thành viên. Vui lòng thử lại!");
        toast.error("Lỗi khi tải danh sách thành viên!");
      }
    })();
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
      const allIds = filteredUsers.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredUsers = users.filter((item) => {
    const name = item.name ? item.name.toString() : "";
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
  const sortedUsers = [...filteredUsers].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các người dùng đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => UserService.delete(id)));
        setUsers((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách người dùng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) {
      try {
        await UserService.delete(id);
        setUsers(users.filter((user) => user.id !== id));
        toast.success("Xóa thành viên thành công!");
      } catch (error) {
        toast.error("Lỗi khi xóa thành viên!");
        console.error("Lỗi khi xóa thành viên:", error);
      }
    }
  };

  // Hàm thay đổi trạng thái hoạt động
  const handleStatus = async (id) => {
    try {
      await UserService.status(id);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: user.status === 1 ? 0 : 1 } : user
        )
      );
      toast.info("Cập nhật trạng thái thành viên thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái!");
      console.error("Lỗi khi cập nhật trạng thái người dùng:", error);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý thành viên</p>
      </div>
      {/* search vs delete */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên người dùng..."
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
      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách thành viên</h2>
        <button className="bg-green-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
          <Link to={"/admin/user/add"}>
            <FaPlus className="inline" /> Thêm
          </Link>
        </button>
        <Link to={"/admin/user/trash"}>
          <button className="bg-red-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaTrash className="inline" /> Thùng rác
          </button>
        </Link>
        {/* Hiển thị lỗi nếu có */}
        {error ? (
          <div className="text-red-500 text-center font-semibold">{error}</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-4 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredUsers.length > 0 &&
                      selectedIds.length === filteredUsers.length
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
                  onClick={() => handleSort("name")}
                >
                  Tên thành viên{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Vai trò{" "}
                  {sortConfig.key === "role" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4">Hình ảnh thu nhỏ</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user, index) => {
                  const images = JSON.parse(user.image);
                  const jsxStatus =
                    user.status === 1 ? (
                      <button
                        onClick={() => handleStatus(user.id)}
                        className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaToggleOn className="inline" /> Đang hoạt động
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatus(user.id)}
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaToggleOff className="inline" /> Không hoạt động
                      </button>
                    );

                  return (
                    <tr key={user.id} className="border-b">
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user.id)}
                          onChange={() => handleCheckboxChange(user.id)}
                        />
                      </td>
                      <td className="p-4">{user.id}</td>
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.role}</td>
                      <td className="p-4">
                        {images.map((image, index) => (
                          <img
                            key={index}
                            src={urlImage + "user/" + image}
                            alt={user.name}
                            className="w-16 h-16 object-cover"
                          />
                        ))}
                      </td>

                      <td className="p-4">{jsxStatus}</td>
                      <td className="p-4">
                        <Link to={`/admin/user/show/${user.id}`}>
                          <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                            <IoEyeSharp className="inline" /> Xem
                          </button>
                        </Link>
                        <Link
                          to={`/admin/user/edit/${user.id}`}
                          className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <FaEdit className="inline" /> Chỉnh sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <MdDelete className="inline" /> Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-4 text-center bg-gray-100 text-gray-500 rounded-md"
                  >
                    Không có thành viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {/* phân trang */}
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
      </section>
    </div>
  );
};

export default UserList;
