import React, { useEffect, useState } from "react";
import BannerService from "../../../services/Bannerservice";
import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrashBannerList = () => {
  const [banners, setBanners] = useState([]); // State để lưu danh sách banner
  const urlImage = "http://127.0.0.1:8000/images/banner/"; 

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const result = await BannerService.trash(); // Gọi API danh sách banner đã xóa
        setBanners(result.banners); // Gán dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi tải danh sách banner đã xóa:", error);
        toast.error("Không thể tải danh sách banner!");
      }
    };
  
    fetchBanners(); 
  }, []);
  

  const handleRestore = async (id) => {
    try {
      await BannerService.restore(id); // Gọi API để khôi phục banner
      setBanners(banners.filter((banner) => banner.id !== id)); // Cập nhật state để loại bỏ banner đã khôi phục
      toast.success("Banner đã được khôi phục!");
    } catch (error) {
      toast.error("Lỗi khi khôi phục banner!");
      console.error("Error restoring banner:", error);
    }
  };

  const handleDeletePermanently = async (id) => {
    try {
      await BannerService.destroy(id); // Gọi API để xóa vĩnh viễn banner
      setBanners(banners.filter((banner) => banner.id !== id)); // Cập nhật state để loại bỏ banner đã xóa
      toast.success("Banner đã bị xóa vĩnh viễn!");
    } catch (error) {
      console.error("Error deleting banner permanently:", error);
      toast.error("Lỗi khi xóa vĩnh viễn!");
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">
          Home / Quản lý Banner / Thùng rác
        </p>
      </div>

      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Danh sách Banner trong Thùng rác
        </h2>
        <Link
          to="/admin/banner"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4">#</th>
              <th className="p-4">Tên Banner</th>
              <th className="p-4 w-28">Hình ảnh</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {banners.length > 0 ? (
              banners.map((banner) => {
                // Nếu hình ảnh là chuỗi JSON thì parse nó thành mảng
                const images = banner.image ? JSON.parse(banner.image) : [];

                return (
                  <tr key={banner.id} className="border-b">
                    <td className="p-4 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="p-4">{banner.name}</td>
                    <td className="p-4">
                      {images.length > 0 ? (
                        images.map((img, index) => (
                          <img
                            key={index}
                            src={`${urlImage}${img}`} // Dùng template string để tạo URL hình ảnh
                            alt={banner.name}
                            className="w-16 h-16 object-cover"
                          />
                        ))
                      ) : (
                        <div>Không có hình ảnh nào</div>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleRestore(banner.id)}
                        className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaTrashRestore className="inline" /> Khôi phục
                      </button>
                      <button
                        onClick={() => handleDeletePermanently(banner.id)}
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaTrash className="inline" /> Xóa vĩnh viễn
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Không có banner nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TrashBannerList;
