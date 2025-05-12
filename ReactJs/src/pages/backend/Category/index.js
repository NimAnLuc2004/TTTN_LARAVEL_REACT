import React, { useEffect, useState } from "react";
import CategoryService from "../../../services/Categoryservice";
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

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // State mới để lưu tất cả danh mục
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    (async () => {
      try {
        // Tải danh mục của trang hiện tại
        const result = await CategoryService.index(page);
        setCategories(result.categories.data ?? []);
        setLastPage(result.categories.last_page);

        // Tải tất cả danh mục (cho danh mục cha)
        const allCats = await CategoryService.index();
        setAllCategories(allCats.categories ?? []);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        setError("Không thể tải danh sách danh mục. Vui lòng thử lại!");
      } finally {
        setLoading(false);
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
      const allIds = filteredCategorys.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const filteredCategorys = categories.filter((item) => {
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

  const sortedCategorys = [...filteredCategorys].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các danh mục đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => CategoryService.delete(id)));
        setCategories((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );
        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách danh mục thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };

  const getCategoryParentName = (category) => {
    if (category.parent_id === null) {
      return "Mục gốc";
    }
    // Sử dụng allCategories thay vì categories
    const parentCategory = allCategories.find(
      (cat) => cat.id === category.parent_id
    );
    return parentCategory ? parentCategory.name : "Không xác định";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await CategoryService.delete(id);
        setCategories(categories.filter((category) => category.id !== id));
        toast.success("Danh mục đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Xóa danh mục thất bại!");
      }
    }
  };

  const handleStatus = async (id) => {
    try {
      await CategoryService.status(id);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id
            ? { ...category, status: category.status === 1 ? 0 : 1 }
            : category
        )
      );
      toast.success("Trạng thái danh mục đã được cập nhật!");
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div>
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Danh mục</p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white py-1 px-3 rounded-md"
        >
          <MdDelete className="inline" /> Xóa đã chọn
        </button>
      </div>
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách Danh mục</h2>
        <Link to={"/admin/category/add"}>
          <button className="bg-green-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaPlus className="inline" /> Thêm
          </button>
        </Link>
        <Link to={"/admin/category/trash"}>
          <button className="bg-red-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaTrash className="inline" /> Thùng rác
          </button>
        </Link>
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
                      filteredCategorys.length > 0 &&
                      selectedIds.length === filteredCategorys.length
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
                  Tên thương hiệu{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4">Hình ảnh</th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("parent_id")}
                >
                  Tên danh mục cha
                  {sortConfig.key === "parent_id" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-4 text-center text-blue-500 font-semibold"
                  >
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-blue-500"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : sortedCategorys.length > 0 ? (
                sortedCategorys.map((category) => (
                  <tr key={category.id} className="border-b">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(category.id)}
                        onChange={() => handleCheckboxChange(category.id)}
                      />
                    </td>
                    <td className="p-4">{category.id}</td>
                    <td className="p-4">{category.name}</td>
                    <td className="p-4">
                      <img
                        src={
                          urlImage + "category/" + JSON.parse(category.image)[0]
                        }
                        alt={category.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="p-4">{getCategoryParentName(category)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatus(category.id)}
                        className={`py-1 px-2 mx-0.5 text-white rounded-md ${
                          category.status === 1 ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {category.status === 1 ? (
                          <>
                            <FaToggleOn className="inline" /> Đang hoạt động
                          </>
                        ) : (
                          <>
                            <FaToggleOff className="inline" /> Không hoạt động
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/admin/category/show/${category.id}`}
                        className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem
                      </Link>
                      <Link
                        to={`/admin/category/edit/${category.id}`}
                        className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaEdit className="inline" /> Chỉnh sửa
                      </Link>
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleDelete(category.id)}
                      >
                        <MdDelete className="inline" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-4 text-center bg-gray-100 text-gray-500 rounded-md"
                  >
                    <p className="text-lg font-semibold">
                      Không có danh mục nào.
                    </p>
                    <p className="text-sm">
                      Hãy thêm danh mục mới để hiển thị danh sách.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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

export default CategoryList;