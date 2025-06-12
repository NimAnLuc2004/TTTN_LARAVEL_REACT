import React, { useEffect, useState } from "react";
import CategoryService from "../../../services/Categoryservice"; // Giả sử có dịch vụ cho danh mục
import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrashCategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTrashCategories = async () => {
      try {
        const result = await CategoryService.trash();
        setCategories(result.categories);
      } catch (error) {
        console.error("Error fetching trash categories:", error);
        toast.error("Lỗi khi tải danh mục!");
      }
    };

    fetchTrashCategories(); // Gọi hàm lấy dữ liệu khi component mount
  }, []);

  const handleRestore = async (id) => {
    try {
      await CategoryService.restore(id);
      setCategories(categories.filter((category) => category.id !== id)); // Cập nhật state để loại bỏ category đã được khôi phục
      toast.success("Khôi phục danh mục thành công!");
    } catch (error) {
      console.error("Error restoring category:", error);
      toast.error("Lỗi khi khôi phục danh mục!");
    }
  };

  const handleDeletePermanently = async (id) => {
    try {
      await CategoryService.destroy(id);
      setCategories(categories.filter((category) => category.id !== id)); // Cập nhật state để loại bỏ category đã xóa
      toast.success("Xóa vĩnh viễn danh mục thành công!");
    } catch (error) {
      console.error("Error deleting category permanently:", error);
      toast.error("Lỗi khi xóa danh mục!");
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">
          Home / Quản lý Danh mục / Thùng rác
        </p>
      </div>

      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Danh sách Danh mục trong Thùng rác
        </h2>
        <Link
          to="/admin/category"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4">#</th>
              <th className="p-4">Tên Danh mục</th>

              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="p-4 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-4">{category.name}</td>

                  <td className="p-4">
                    <button
                      onClick={() => handleRestore(category.id)}
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrashRestore className="inline" /> Khôi phục
                    </button>
                    <button
                      onClick={() => handleDeletePermanently(category.id)}
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrash className="inline" /> Xóa vĩnh viễn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Không có danh mục nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TrashCategoryList;
