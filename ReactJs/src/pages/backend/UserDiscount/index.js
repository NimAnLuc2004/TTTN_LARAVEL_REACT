import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDiscountService from "../../../services/UserDiscountService";

const UserDiscountIndex = () => {
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserDiscountService.index(currentPage);
        if (response.status) {
          setUserDiscounts(response.data);
          setCurrentPage(response.pagination.current_page || 1);
          setLastPage(response.pagination.last_page || 1);
          setTotal(response.pagination.total || response.data.length);
        } else {
          toast.error("Không thể lấy danh sách mã giảm giá.", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error fetching user discounts:", error);
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

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bản ghi này?")) {
      try {
        const response = await UserDiscountService.destroy(id);
        if (response.status) {
          setUserDiscounts(userDiscounts.filter((item) => item.id !== id));
          toast.success("Xóa mã giảm giá thành công!", { position: "top-right" });
        } else {
          toast.error(response.message, { position: "top-right" });
        }
      } catch (error) {
        console.error("Error deleting user discount:", error);
        toast.error("Có lỗi xảy ra khi xóa mã giảm giá.", { position: "top-right" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Danh Sách Mã Giảm Giá Người Dùng</h1>
          <Link
            to="/admin/userdiscount/add"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Thêm Mới
          </Link>
        </div>
        <table className="w-full border-collapse border-2 border-gray-300 text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-2 border-gray-300 p-4 text-left">ID</th>
              <th className="border-2 border-gray-300 p-4 text-left">Tên Người Dùng</th>
              <th className="border-2 border-gray-300 p-4 text-left">Email</th>
              <th className="border-2 border-gray-300 p-4 text-left">Mã Giảm Giá</th>
              <th className="border-2 border-gray-300 p-4 text-left">Phần Trăm Giảm</th>
              <th className="border-2 border-gray-300 p-4 text-left">Trạng Thái</th>
              <th className="border-2 border-gray-300 p-4 text-left">Thời Gian Tạo</th>
              <th className="border-2 border-gray-300 p-4 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {userDiscounts.length > 0 ? (
              userDiscounts.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border-2 border-gray-300 p-4">{item.id}</td>
                  <td className="border-2 border-gray-300 p-4">{item.user?.name || "N/A"}</td>
                  <td className="border-2 border-gray-300 p-4">{item.user?.email || "N/A"}</td>
                  <td className="border-2 border-gray-300 p-4">{item.discount?.code || "N/A"}</td>
                  <td className="border-2 border-gray-300 p-4">{item.discount?.discount_percent || 0}%</td>
                  <td className="border-2 border-gray-300 p-4">
                    {item.status === 1 ? "Chưa sử dụng" : "Đã sử dụng"}
                  </td>
                  <td className="border-2 border-gray-300 p-4">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="border-2 border-gray-300 p-4">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(item.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border-2 border-gray-300 p-4 text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
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
    </div>
  );
};

export default UserDiscountIndex;