import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BannerService from "../../../services/Bannerservice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowBanner = () => {
  const { id } = useParams();
  const [banner, setBanner] = useState(null);
  const urlImage = "http://127.0.0.1:8000/images/banner/";
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const result = await BannerService.show(id); // Hàm show cần được thêm vào Bannerservice
        setBanner(result.banners); // Gán banner từ API vào state

      } catch (error) {
        console.error("Error fetching banner:", error);
        toast.error("Lỗi khi tải dữ liệu banner!");
      }
    };

    fetchBanner();
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
  if (!banner) return <div>Đang tải...</div>; // Hiển thị khi chưa có dữ liệu

  // Nếu banner.image là chuỗi JSON thì parse nó thành mảng
  const images = banner.image ? JSON.parse(banner.image) : [];

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết Banner</h2>
      <div className="mb-4">
        <strong>Tên Banner:</strong> {banner.name}
      </div>
      <div className="mb-4">
        <strong>Link:</strong> {banner.link}
      </div>
      <div className="mb-4">
        <strong>Mô tả:</strong> {banner.description}
      </div>
      <div className="mb-4">
        <strong>Sắp xếp:</strong> {banner.sort_order}
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(banner.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(banner.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {banner.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {banner.updated_by}
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
                alt={banner.name}
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
        {banner.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
      </div>
      <Link
        to="/admin/banner"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowBanner;
