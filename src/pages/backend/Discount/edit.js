import React, { useState, useEffect } from "react";
import DiscountService from "../../../services/Discountservice";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DiscountEdit = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [valid, setValid] = useState("");
  const [status, setStatus] = useState(1);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const result = await DiscountService.show(id);
        const discount = result.discount;
        if (discount) {
          setCode(discount.code);
          setPercent(discount.discount_percent);
          setValid(discount.valid_until);
          setStatus(discount.status);
        }
      } catch (error) {
        console.error("Error fetching discount:", error);
        toast.error("Có lỗi xảy ra khi tải thông tin mã giảm giá!");
      }
    };

    fetchDiscount();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate expiration date
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    if (valid < today) {
      toast.error("Ngày hết hạn không được nhỏ hơn ngày hôm nay!", { position: "top-right" });
      return;
    }

    try {
      const response = await DiscountService.update(
        {
          code,
          discount_percent: percent,
          valid_until: valid,
          status,
        },
        id
      );
      if (response.status) {
        toast.success("Cập nhật mã giảm giá thành công!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error updating discount:", error);
      toast.error("Có lỗi xảy ra khi cập nhật mã giảm giá!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-md p-6">
        <div className="py-3">
          <Link
            to="/admin/discount"
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Quay lại
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Chỉnh sửa mã giảm giá
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Mã giảm giá
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Phần trăm giảm
            </label>
            <input
              type="number"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Ngày hết hạn
            </label>
            <input
              type="date"
              value={valid}
              onChange={(e) => setValid(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cập nhật mã giảm giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountEdit;