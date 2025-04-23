import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import OrderService from "../../../services/Orderservice";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const result = await OrderService.show(id);
        console.log(result);
        setOrder(result.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();
  }, [id]);

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

  const formatCurrency = (value) =>
    Number(value).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return <span className="text-yellow-500 font-medium">Chờ xử lý</span>;
      case "processing":
        return <span className="text-blue-500 font-medium">Đang xử lý</span>;
      case "shipped":
        return <span className="text-purple-500 font-medium">Đã giao</span>;
      case "complete":
        return <span className="text-green-600 font-medium">Hoàn thành</span>;
      case "cancelled":
        return <span className="text-red-600 font-medium">Đã hủy</span>;
      default:
        return <span className="text-gray-500">Không xác định</span>;
    }
  };

  if (!order) {
    return <p className="text-center mt-10 text-lg">Đang tải dữ liệu...</p>;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Chi Tiết Đơn Hàng
        </h2>

        <div className="grid grid-cols-2 gap-6 text-lg text-gray-700">
          <div>
            <span className="font-semibold">Mã đơn hàng:</span> #{order.id}
          </div>
          <div>
            <span className="font-semibold">ID Khách hàng:</span> {order.user_id}
          </div>
          <div>
            <span className="font-semibold">Người tạo:</span> {order.created_by}
          </div>
          <div>
            <span className="font-semibold">Người cập nhật:</span> {order.updated_by}
          </div>
          <div>
            <span className="font-semibold">Tổng giá tiền:</span> {formatCurrency(order.total)}
          </div>
          <div>
            <span className="font-semibold">Trạng thái:</span> {getStatusLabel(order.status)}
          </div>
          <div>
            <span className="font-semibold">Ngày tạo:</span> {formatDate(order.created_at)}
          </div>
          <div>
            <span className="font-semibold">Ngày cập nhật:</span> {formatDate(order.updated_at)}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/admin/order"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow transition"
          >
             Quay lại danh sách
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
