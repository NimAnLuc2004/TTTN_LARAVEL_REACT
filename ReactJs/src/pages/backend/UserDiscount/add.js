import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../../services/Userservice";
import DiscountService from "../../../services/Discountservice";
import UserDiscountService from "../../../services/UserDiscountService";

const UserDiscountAdd = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResult = await UserService.index();
        const discountResult = await DiscountService.index(currentPage);

        if (userResult.status) {
          const userData = userResult.users.data || userResult.users;
          setUsers(userData);
        } else {
          toast.error("Không thể lấy danh sách người dùng.", { position: "top-right" });
        }

        if (discountResult.status) {
          const discountData = discountResult.discount.data || discountResult.discount;
          setDiscounts(discountData);
          setCurrentPage(discountResult.discount.current_page || 1);
          setLastPage(discountResult.discount.last_page || 1);
          setTotal(discountResult.discount.total || discountData.length);
        } else {
          toast.error("Không thể lấy danh sách mã giảm giá.", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Có lỗi xảy ra khi lấy dữ liệu.", { position: "top-right" });
      }
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedDiscount) {
      setMessage("Vui lòng chọn người dùng và mã giảm giá.");
      toast.error("Vui lòng chọn người dùng và mã giảm giá.", { position: "top-right" });
      return;
    }

    const formData = {
      user_id: selectedUser,
      discount_id: selectedDiscount,
      status,
    };

    try {
      const response = await UserDiscountService.store(formData);
      if (response.data.status) {
        setMessage("Thêm mã giảm giá cho người dùng thành công!");
        toast.success("Thêm mã giảm giá cho người dùng thành công!", { position: "top-right" });
        setSelectedUser("");
        setSelectedDiscount("");
        setStatus(1);
      } else {
        toast.error(response.data.message, { position: "top-right" });
      }
    } catch (error) {
      console.error("Error adding user discount:", error);
      setMessage("Có lỗi xảy ra khi thêm mã giảm giá.");
      toast.error("Có lỗi xảy ra khi thêm mã giảm giá.", { position: "top-right" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-md p-8">
        <Link to="/admin/userdiscount" className="bg-red-500 text-white px-4 py-2 rounded-md">
          Quay lại
        </Link>
        <h1 className="text-3xl font-bold my-4 text-center">Thêm Mã Giảm Giá Cho Người Dùng</h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Người Dùng</label>
            <select
              className="w-full border p-2 rounded max-h-40 overflow-y-auto"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Chọn người dùng</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} id:({user.id || "N/A"})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Mã Giảm Giá</label>
            <select
              className="w-full bor
der p-2 rounded max-h-40 overflow-y-auto"
              value={selectedDiscount}
              onChange={(e) => setSelectedDiscount(e.target.value)}
              required
            >
              <option value="">Chọn mã giảm giá</option>
              {discounts.map((discount) => (
                <option key={discount.id} value={discount.id}>
                  {discount.code} ({discount.discount_percent}%) id:{discount.id}
                </option>
              ))}
            </select>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Trang {currentPage} / {lastPage} (Tổng: {total})
              </span>
              <button
                type="button"
                className={`px-4 py-2 rounded ${currentPage === lastPage ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                Next
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Trạng Thái</label>
            <select
              className="w-full border p-2 rounded"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              required
            >
              <option value="1">Chưa sử dụng</option>
              <option value="0">Đã sử dụng</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
              Thêm Mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDiscountAdd;