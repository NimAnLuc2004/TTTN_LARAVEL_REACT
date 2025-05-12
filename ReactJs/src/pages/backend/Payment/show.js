import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PaymentService from "../../../services/Paymentservice";

const PaymentDetail = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const result = await PaymentService.show(id);

        setPayment(result.payment);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };
    fetchPaymentDetails();
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

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return <span className="text-yellow-500 font-medium">Đang xử lý</span>;
      case "complete":
        return <span className="text-green-600 font-medium">Hoàn thành</span>;
      case "failed":
        return <span className="text-red-600 font-medium">Đã hủy</span>;
      default:
        return <span className="text-gray-500">Không xác định</span>;
    }
  };

  if (!payment) {
    return <p className="text-center mt-10 text-lg">Đang tải dữ liệu...</p>;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Chi Tiết Thanh Toán
        </h2>

        <div className="grid grid-cols-2 gap-6 text-lg text-gray-700">
          <div>
            <span className="font-semibold">ID thanh toán:</span> #{payment.id}
          </div>
          <div>
            <span className="font-semibold">ID đơn hàng:</span> {payment.order_id}
          </div>
          <div>
            <span className="font-semibold">Phương thức thanh toán:</span> {payment.payment_method}
          </div>
          <div>
            <span className="font-semibold">Trạng thái:</span> {getStatusLabel(payment.status)}
          </div>
          <div>
            <span className="font-semibold">Ngày tạo:</span> {formatDate(payment.created_at)}
          </div>
          <div>
            <span className="font-semibold">Ngày cập nhật:</span> {formatDate(payment.updated_at)}
          </div>
          <div>
            <span className="font-semibold">Người tạo:</span> {payment.created_by}
          </div>
          <div>
            <span className="font-semibold">Người cập nhật:</span> {payment.updated_by}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/admin/payment"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow transition"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentDetail;
