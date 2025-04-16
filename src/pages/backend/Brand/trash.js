import React, { useEffect, useState } from "react";
import BrandService from "../../../services/Brandservice";
import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrashBrandList = () => {
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await BrandService.trash(); // Gọi API danh sách thương hiệu đã xóa
        setBrands(result.brands); // Gán dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi tải danh sách thương hiệu đã xóa:", error);
        toast.error("Không thể tải danh sách thương hiệu!");
      }
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      await BrandService.restore(id);
      setBrands(brands.filter((brand) => brand.id !== id));
    } catch (error) {
      console.error("Error restoring brand:", error);
      toast.warning("Không thể tải danh sách thương hiệu!");
    }
  };

  const handleDeletePermanently = async (id) => {
    try {
      await BrandService.destroy(id);
      setBrands(brands.filter((brand) => brand.id !== id)); // Cập nhật state để loại bỏ brand đã xóa
      toast.success("Khôi phục thương hiệu thành công!");
    } catch (error) {
      console.error("Error deleting brand permanently:", error);
      toast.error("Lỗi khi khôi phục thương hiệu!");
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">
          Home / Quản lý thương hiệu / Thùng rác
        </p>
      </div>

      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Danh sách thương hiệu trong Thùng rác
        </h2>
        <Link
          to="/admin/brand"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4">#</th>
              <th className="p-4">Tên thương hiệu</th>

              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((brand) => (
                <tr key={brand.id} className="border-b">
                  <td className="p-4 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-4">{brand.name}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRestore(brand.id)}
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrashRestore className="inline" /> Khôi phục
                    </button>
                    <button
                      onClick={() => handleDeletePermanently(brand.id)}
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrash className="inline" /> Xóa vĩnh viễn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Không có thương hiệu nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TrashBrandList;
