import React, { useEffect, useState } from "react";
import MenuService from "../../../services/Menuservice"; // Import dịch vụ API cho menu
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

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
 //phân trang
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  useEffect(() => {
    const fetchMenus = async () => {
      const result = await MenuService.index(page);

      setMenus(result.menu.data ?? []);
      setLastPage(result.menu.last_page);
    };
    fetchMenus();
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
      const allIds = filteredMenus.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredMenus = menus.filter((item) => {
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
  const sortedMenus = [...filteredMenus].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các menu đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => MenuService.delete(id)));
        setMenus((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách menu thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa menu này?")) {
      try {
        await MenuService.delete(id);
        setMenus(menus.filter((menu) => menu.id !== id));
        toast.success("Xóa menu thành công!");
      } catch (error) {
        console.error("Error deleting menu:", error);
        toast.error("Xóa menu thất bại!");
      }
    }
  };

  const handleStatus = async (id) => {
    try {
      await MenuService.status(id);
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === id ? { ...menu, status: menu.status === 1 ? 0 : 1 } : menu
        )
      );
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating menu status:", error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý menu</p>
      </div>
      {/* search vs delete */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên menu..."
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
        <h2 className="text-lg font-semibold mb-4">Danh sách menu</h2>
        <Link to={"/admin/menu/add"}>
          <button className="bg-green-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaPlus className="inline" /> Thêm
          </button>
        </Link>
        <Link to={`/admin/menu/trash`}>
          <button className="bg-red-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaTrash className="inline" /> Thùng rác
          </button>
        </Link>

        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredMenus.length > 0 &&
                    selectedIds.length === filteredMenus.length
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
                Tên Menu{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              
              <th className="p-4">Link menu</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedMenus.length > 0 ? (
              sortedMenus.map((menu, index) => {
                const jsxStatus =
                  menu.status === 1 ? (
                    <button
                      onClick={() => handleStatus(menu.id)}
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaToggleOn className="inline" /> Đang hoạt động
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatus(menu.id)}
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaToggleOff className="inline" /> Không hoạt động
                    </button>
                  );

                return (
                  <tr key={menu.id} className="border-b">
                    <td className="p-4 text-center">
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(menu.id)}
                        onChange={() => handleCheckboxChange(menu.id)}
                      />
                    </td>
                    <td className="p-4">{menu.id}</td>
                    <td className="p-4">{menu.name}</td>
                    <td className="p-4">{menu.link}</td>
                    <td className="p-4">{jsxStatus}</td>
                    <td className="p-4">
                      <Link to={`/admin/menu/show/${menu.id}`}>
                        <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                          <IoEyeSharp className="inline" /> Xem
                        </button>
                      </Link>
                      <Link to={`/admin/menu/edit/${menu.id}`}>
                        <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md">
                          <FaEdit className="inline" /> Chỉnh sửa
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(menu.id)}
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
                  Không có menu nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default MenuList;