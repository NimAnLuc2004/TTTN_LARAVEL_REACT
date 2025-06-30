import React, { useEffect, useState } from "react";
import DiscountService from "../../../services/Discountservice";
import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrashDiscountList = () => {
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await DiscountService.trash(); // Gọi API danh sách mã giảm giá đã xóa
        setDiscounts(result.discount); // Gán dữ liệu vào state
  
      } catch (error) {
        console.error("Lỗi khi tải danh sách mã giảm giá đã xóa:", error);
        toast.error("Không thể tải danh sách mã giảm giá!");
      }
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      await DiscountService.restore(id);
      setDiscounts(discounts.filter((discount) => discount.id !== id));
      toast.success("Khôi phục mã giảm giá thành công!");
    } catch (error) {
      console.error("Lỗi khi khôi phục mã giảm giá:", error);
      toast.warning("Không thể khôi phục mã giảm giá!");
    }
  };

  const handleDeletePermanently = async (id) => {
    try {
      await DiscountService.destroy(id);
      setDiscounts(discounts.filter((discount) => discount.id !== id));
      toast.success("Xóa vĩnh viễn mã giảm giá thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa vĩnh viễn mã giảm giá:", error);
      toast.error("Lỗi khi xóa vĩnh viễn mã giảm giá!");
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">
          Home / Quản lý mã giảm giá / Thùng rác
        </p>
      </div>

      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Danh sách mã giảm giá trong Thùng rác
        </h2>
        <Link
          to="/admin/discount"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        <table className="w-full table-auto mt-4">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4">#</th>
              <th className="p-4">Mã giảm giá</th>
              <th className="p-4">Phần trăm</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length > 0 ? (
              discounts.map((discount, index) => (
                <tr key={discount.id} className="border-b">
                  <td className="p-4 text-center">{index + 1}</td>
                  <td className="p-4">{discount.code}</td>
                  <td className="p-4">{discount.discount_percent}%</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRestore(discount.id)}
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrashRestore className="inline" /> Khôi phục
                    </button>
                    <button
                      onClick={() => handleDeletePermanently(discount.id)}
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
                  Không có mã giảm giá nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TrashDiscountList;
