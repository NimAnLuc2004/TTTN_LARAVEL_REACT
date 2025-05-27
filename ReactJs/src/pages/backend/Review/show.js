import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReviewService from "../../../services/Reviewservice";

const ShowReview = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const result = await ReviewService.show(id); 
        setReview(result.review);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview(); // Gọi hàm lấy dữ liệu khi component mount
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
  if (!review) return <div>Đang tải...</div>; // Hiển thị khi chưa có dữ liệu

  // Nếu review.image là chuỗi JSON thì parse nó thành mảng
  const images = review.image ? JSON.parse(review.image) : [];

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết Review</h2>
      <div className="mb-4">
        <strong>Tên sản phẩm:</strong> {review.product_name}
      </div>
      <div className="mb-4">
        <strong>Id User:</strong> {review.user_id}
      </div>
      <div className="mb-4">
        <strong>Rating:</strong> {review.rating}
      </div>
      <div className="mb-4">
        <strong>Bình luận:</strong> {review.comment}
      </div>
      
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(review.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(review.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {review.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {review.updated_by}
      </div>
      <Link
        to="/admin/review"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowReview;
