import React, { useEffect, useState } from "react";
import OrderService from "../../../services/Orderservice";
import { IoEyeSharp } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [lastPage, setLastPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;
    
  useEffect(() => {
    (async () => {
      try {
        const result = await OrderService.index(page);
        setOrders(result.orders.data??[]);

        setLastPage(result.orders.last_page);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        toast.error("Không thể tải danh sách đơn hàng!");
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
      const allIds = filteredOrders.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredOrders = orders.filter((item) => {
    const name = item.user_id ? item.user_id.toString() : "";
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
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleCancelSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info("Vui lòng chọn ít nhất một đơn hàng để hủy.");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn hủy các đơn hàng đã chọn?")) {
      try {
        await Promise.all(
          selectedIds.map((id) =>
            OrderService.status(id, { status: "cancelled" })
          )
        );

        setOrders((prev) =>
          prev.map((order) =>
            selectedIds.includes(order.id)
              ? { ...order, status: "cancelled" }
              : order
          )
        );

        setSelectedIds([]);
        toast.success("Đã chuyển các đơn hàng sang trạng thái 'Đã hủy'.");
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        toast.error("Đã xảy ra lỗi khi hủy đơn hàng!");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (window.confirm("Bạn có chắc chắn muốn cập nhật trạng thái?")) {
      try {
        const response = await OrderService.status(id, {
          status: newStatus,
        });
        if (response.status) {
          setOrders(
            orders.map((order) =>
              order.id === id ? { ...order, status: newStatus } : order
            )
          );
          toast.success("Cập nhật trạng thái thành công!");
          window.location.reload();
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        toast.error("Không thể cập nhật trạng thái!");
      }
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Đơn hàng</p>
      </div>
      {/* search vs delete */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo id khách hàng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="border border-gray-300 px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleCancelSelected}
          className="bg-red-600 text-white py-1 px-3 rounded-md"
        >
          <FaTrash className="inline" /> Hủy đã chọn
        </button>
      </div>
      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách Đơn hàng</h2>
        <Link to={`/admin/order/trash`}>
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
                    filteredOrders.length > 0 &&
                    selectedIds.length === filteredOrders.length
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
                onClick={() => handleSort("user_id")}
              >
                Id Khách hàng{" "}
                {sortConfig.key === "user_id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("total")}
              >
                Tổng giá tiền{" "}
                {sortConfig.key === "total" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="p-4">Trạng Thái</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order, index) => {
                return (
                  <tr key={order.id} className="border-b">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => handleCheckboxChange(order.id)}
                      />
                    </td>
                    <td className="p-4">{order.id}</td>
                    <td className="p-4">{order.user_id}</td>
                    <td className="p-4">{order.total}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`border rounded p-1 text-white ${
                          order.status === "pending"
                            ? "bg-yellow-500"
                            : order.status === "processing"
                            ? "bg-blue-500"
                            : order.status === "shipped"
                            ? "bg-purple-500"
                            : order.status === "completed"
                            ? "bg-green-500"
                            : order.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-gray-200"
                        }`}
                      >
                        <option className="bg-white text-black" value="pending">
                          Chờ xử lý
                        </option>
                        <option
                          className="bg-white text-black"
                          value="processing"
                        >
                          Đang xử lý
                        </option>
                        <option className="bg-white text-black" value="shipped">
                          Đã giao
                        </option>
                        <option
                          className="bg-white text-black"
                          value="completed"
                        >
                          Hoàn thành
                        </option>
                        <option
                          className="bg-white text-black"
                          value="cancelled"
                        >
                          Đã hủy
                        </option>
                      </select>
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/admin/order/show/${order.id}`}
                        className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem
                      </Link>
                      <Link
                        to={`/admin/order/edit/${order.id}`}
                        className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaEdit className="inline" /> Chỉnh sửa
                      </Link>
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
                  <p className="text-lg font-semibold">
                    Không có đơn hàng nào.
                  </p>
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

export default OrderList;
