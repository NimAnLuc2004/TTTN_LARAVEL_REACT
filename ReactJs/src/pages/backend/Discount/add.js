import React, { useState } from "react";
import DiscountService from "../../../services/Discountservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DiscountAdd = () => {
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [valid, setValid] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate expiration date
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    if (valid < today) {
      setMessage("Hạn sử dụng không được nhỏ hơn ngày hôm nay.");
      toast.error("Hạn sử dụng không được nhỏ hơn ngày hôm nay.", {
        position: "top-right",
      });
      return;
    }

    const formData = {
      code,
      discount_percent: percent,
      valid_until: valid,
      status,
    };

    try {
      const result = await DiscountService.insert(formData);
      if (result.status) {
        setMessage("Thêm phiếu giảm giá thành công!");
        toast.success("Thêm phiếu giảm giá thành công!", {
          position: "top-right",
        });
        //Reset from
        setCode("");
        setPercent("");
        setValid("");
        setStatus(1);
      } else {
        toast.error(result.message, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error adding discount:", error);
      setMessage("Có lỗi xảy ra khi thêm phiếu giảm giá.");
      toast.error("Có lỗi xảy ra khi thêm phiếu giảm giá.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-md p-8">
        <Link
          to="/admin/discount"
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        <h1 className="text-3xl font-bold my-4 text-center">
          Thêm Phiếu Giảm Giá
        </h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Mã Giảm Giá
            </label>
            <input
              className="w-full border p-2 rounded"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Phần Trăm Giảm
            </label>
            <input
              className="w-full border p-2 rounded"
              type="number"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Hạn Sử Dụng
            </label>
            <input
              className="w-full border p-2 rounded"
              type="date"
              value={valid}
              onChange={(e) => setValid(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Trạng Thái
            </label>
            <select
              className="w-full border p-2 rounded"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              required
            >
              <option value="1">Kích Hoạt</option>
              <option value="0">Không Kích Hoạt</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              type="submit"
            >
              Thêm Mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountAdd;
