import React, { useEffect, useState } from "react";
import OrderService from "../../../services/Orderservice";
import { Link } from "react-router-dom";
import { MdRestore, MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify"; // ✅ Import thư viện
import "react-toastify/dist/ReactToastify.css";

const OrderTrash = () => {
  const [deletedOrders, setDeletedOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await OrderService.trash();
        setDeletedOrders(result.orders);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        toast.error("Lỗi khi tải danh sách đơn hàng!");
      }
    })();
  }, []);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  // Xử lý khôi phục đơn hàng
  const handleRestore = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục đơn hàng này?")) {
      try {
        await OrderService.restore(id);
        setDeletedOrders(deletedOrders.filter((order) => order.id !== id));
        toast.success("Đã khôi phục đơn hàng!");
      } catch (error) {
        console.error("Error restoring order:", error);
        toast.error("Không thể khôi phục đơn hàng!");
      }
    }
  };

  // Xóa vĩnh viễn đơn hàng
  const handleDeleteForever = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này?")) {
      try {
        await OrderService.destroy(id);
        setDeletedOrders(deletedOrders.filter((order) => order.id !== id));
        toast.success("Đơn hàng đã bị xóa vĩnh viễn!");
      } catch (error) {
        console.error("Error permanently deleting order:", error);
        toast.error("Không thể xóa vĩnh viễn đơn hàng!");
      }
    }
  };

  return (
    <div>
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">
          Home / Quản lý Đơn hàng / Thùng rác
        </p>
      </div>

      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Thùng rác Đơn hàng</h2>
        <Link
          to="/admin/order"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 inline-block"
        >
          Quay lại
        </Link>

        <table className="w-full table-auto mt-4">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4">#</th>
              <th className="p-4">ID</th>
              <th className="p-4">ID Khách Hàng</th>
              <th className="p-4">Ngày Xóa</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {deletedOrders.length > 0 ? (
              deletedOrders.map((order, index) => (
                <tr key={order.id} className="border-b">
                  <td className="p-4 text-center">{index + 1}</td>
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.user_id}</td>
                  <td className="p-4">{formatDate(order.updated_at)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRestore(order.id)}
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <MdRestore className="inline" /> Khôi phục
                    </button>
                    <button
                      onClick={() => handleDeleteForever(order.id)}
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <MdDeleteForever className="inline" /> Xóa vĩnh viễn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Không có đơn hàng nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default OrderTrash;
