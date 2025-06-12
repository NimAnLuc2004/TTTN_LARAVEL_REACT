import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BrandService from "../../../services/Brandservice";

const ShowBrand = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const urlImage = "https://zstore.click/images/brand/";
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const result = await BrandService.show(id); // Hàm show cần được thêm vào Brandservice
        setBrand(result.brands); // Gán brand từ API vào state
      } catch (error) {
        console.error("Error fetching brand:", error);
      }
    };

    fetchBrand(); // Gọi hàm lấy dữ liệu khi component mount
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
  if (!brand) return <div>Đang tải...</div>; // Hiển thị khi chưa có dữ liệu

  // Nếu brand.image là chuỗi JSON thì parse nó thành mảng
  const images = brand.image ? JSON.parse(brand.image) : [];

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết thương hiệu</h2>
      <div className="mb-4">
        <strong>Tên Brand:</strong> {brand.name}
      </div>
      <div className="mb-4">
        <strong>Mô tả:</strong> {brand.description}
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(brand.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(brand.updated_at)}
      </div>
      
      <div className="mb-4">
        <strong>Người tạo:</strong> {brand.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {brand.updated_by}
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
                alt={brand.name}
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
        {brand.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
      </div>
      <Link
        to="/admin/brand"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowBrand;
