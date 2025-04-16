import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DiscountService from "../../../services/Discountservice";

const ShowDiscount = () => {
  const { id } = useParams();
  const [discount, setDiscount] = useState(null);
  const urlImage = "http://127.0.0.1:8000/images/discount/";
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const result = await DiscountService.show(id); // Hàm show cần được thêm vào Discountservice
        setDiscount(result.discount); // Gán discount từ API vào state
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    };

    fetchDiscount(); // Gọi hàm lấy dữ liệu khi component mount
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
  if (!discount) return <div>Đang tải...</div>; // Hiển thị khi chưa có dữ liệu

  // Nếu discount.image là chuỗi JSON thì parse nó thành mảng
  const images = discount.image ? JSON.parse(discount.image) : [];

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết phiếu giảm giá</h2>
      <div className="mb-4">
        <strong>Code:</strong> {discount.code}
      </div>
      <div className="mb-4">
        <strong>Phần trăm giảm:</strong> {discount.discount_percent}
      </div>
      <div className="mb-4">
        <strong>Ngày hết hạn:</strong> {discount.valid_until}
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(discount.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(discount.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {discount.created_at}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {discount.updated_by}
      </div>
 
      <Link
        to="/admin/discount"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowDiscount;
