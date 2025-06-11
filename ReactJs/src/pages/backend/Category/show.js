import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CategoryService from "../../../services/Categoryservice";

const ShowCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const urlImage = "http://127.0.0.1:8000/images/category/";

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await CategoryService.show(id); // Hàm show cần được thêm vào Categoryservice
        setCategory(result.categories); // Gán category từ API vào state
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory(); // Gọi hàm lấy dữ liệu khi component mount
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
  if (!category) return <div>Đang tải...</div>; // Hiển thị khi chưa có dữ liệu

  // Nếu category.image là chuỗi JSON thì parse nó thành mảng
  const images = category.image ? JSON.parse(category.image) : [];

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết Danh mục</h2>
      <div className="mb-4">
        <strong>Tên Danh mục:</strong> {category.name}
      </div>
      <div className="mb-4">
        <strong>Danh mục gốc:</strong>{" "}
        {category.parent_id === null ? "Danh mục cha" : category.parent_id}
      </div>

      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(category.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(category.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {category.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {category.updated_by}
      </div>
      <div className="mb-4">
        <strong>Hình ảnh:</strong>
        <div className="flex space-x-4">
          {/* Lặp qua các hình ảnh nếu có */}
          {images.length > 0 ? (
            images.map((img, index) => (
              <img
                key={index}
                src={urlImage + img}
                alt={category.name}
                className="mt-2 w-48 h-48 object-cover"
              />
            ))
          ) : (
            <div>Không có hình ảnh nào</div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <strong>Trạng thái:</strong>{" "}
        {category.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
      </div>
      <Link
        to="/admin/category"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowCategory;
