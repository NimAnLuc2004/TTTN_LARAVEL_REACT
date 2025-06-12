import React, { useState, useEffect } from "react";
import PaymentService from "../../../services/Paymentservice";
import { IoEyeSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const PaymentStoreAdd = () => {
  const [completed, setCompleted] = useState([]);
  const [pending, setPending] = useState([]);
  const [failed, setFailed] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  //phân trang
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const fetchAllPayments = async () => {
    try {
      const result = await PaymentService.pending({ page });
      const result1 = await PaymentService.completed({ page });
      const result2 = await PaymentService.failed({ page });

      setCompleted(result1?.payment.data || []);
      setPending(result?.payment.data || []);
      setFailed(result2?.payment.data || []);

      setLastPage(result?.payment?.last_page || 1);
      if (
        !result1.payment.data.length &&
        !result.payment.data.length &&
        !result2.payment.data.length
      ) {
        toast.info("Hiện tại không có thanh toán nào.");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Lỗi khi tải dữ liệu thanh toán.");
    }
  };

  useEffect(() => {
    fetchAllPayments();
  }, [page]);

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e, list) => {
    if (e.target.checked) {
      const allIds = list.map((item) => item.id);
      setSelectedIds((prev) => [...new Set([...prev, ...allIds])]);
    } else {
      const idsToRemove = list.map((item) => item.id);
      setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    }
  };

  const filterBySearchTerm = (list) => {
    return list.filter((item) => {
      const name = item.order_id ? item.order_id.toString() : "";
      return removeVietnameseTones(name.toLowerCase()).includes(
        removeVietnameseTones(searchTerm.toLowerCase())
      );
    });
  };

  const filteredPending = filterBySearchTerm(pending);
  const filteredCompleted = filterBySearchTerm(completed);
  const filteredFailed = filterBySearchTerm(failed);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortList = (list) => {
    return [...list].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aRaw = a[sortConfig.key] ?? "";
      const bRaw = b[sortConfig.key] ?? "";

      // Kiểm tra xem giá trị có thể chuyển thành số hợp lệ không
      const aIsNumber = !isNaN(Number(aRaw)) && aRaw !== "";
      const bIsNumber = !isNaN(Number(bRaw)) && bRaw !== "";

      // Nếu cả hai giá trị đều là số hợp lệ, so sánh như số
      if (aIsNumber && bIsNumber) {
        const aValue = Number(aRaw);
        const bValue = Number(bRaw);
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // Nếu không, so sánh như chuỗi
      const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info("Vui lòng chọn ít nhất một mục để xóa.");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các thanh toán đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => PaymentService.destroy(id)));
        window.location.reload();
        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách thanh toán thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhập kho này?")) {
      try {
        await PaymentService.destroy(id);
        setPending((prev) => prev.filter((payment) => payment.id !== id));
        toast.success("Đã xóa đơn hàng thanh toán!");
      } catch (error) {
        console.error("Error deleting paymentstore:", error);
        toast.error("Lỗi khi xóa đơn hàng thanh toán!");
      }
    }
  };

  const renderTable = (title, list, showActions = true) => {
    const sortedList = sortList(list);
    return (
      <div className="basis-4/12 bg-white shadow-md rounded-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e, sortedList)}
                  checked={sortedList.every((item) =>
                    selectedIds.includes(item.id)
                  )}
                />
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("order_id")}
              >
                Id đơn hàng{" "}
                {sortConfig.key === "order_id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="p-4">Cách thanh toán</th>
              {showActions && <th className="p-4">Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {sortedList.length > 0 ? (
              sortedList.map((payment, index) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(payment.id)}
                      onChange={() => handleCheckboxChange(payment.id)}
                    />
                  </td>
                  <td className="p-4">{payment.id}</td>
                  <td className="p-4">{payment.order_id}</td>
                  <td className="p-4">{payment.payment_method}</td>
                  {showActions && (
                    <td className="p-4">
                      <Link
                        to={`/admin/payment/show/${payment.id}`}
                        className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem
                      </Link>
                      {title.includes("xử lý") && (
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <MdDelete className="inline" /> Xóa
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showActions ? 5 : 4}
                  className="p-4 text-center text-gray-500"
                >
                  Không có thanh toán đơn hàng nào.
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
      </div>
    );
  };

  return (
    <>
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý thanh toán</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo id đơn hàng..."
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
      <p className="text-sm text-gray-500 text-center mt-2">
        Tổng cộng: {pending.length + completed.length + failed.length} bản ghi
      </p>

      <div className="flex flex-row gap-4">
        {renderTable("Đơn hàng thanh toán đang xử lý", filteredPending)}
        {renderTable("Đơn hàng thanh toán thành công", filteredCompleted)}
        {renderTable("Đơn hàng thanh toán thất bại", filteredFailed)}
      </div>
    </>
  );
};

export default PaymentStoreAdd;
