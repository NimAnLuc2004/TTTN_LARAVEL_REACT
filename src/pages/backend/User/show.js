import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import UserService from "../../../services/Userservice";

const ShowUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const urlImage = "http://127.0.0.1:8000/images/user/";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await UserService.show(id); // Gọi API để lấy thông tin người dùng
        setUser(result);
        
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <div>Đang tải...</div>;
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
  const images = user.user.image ? JSON.parse(user.user.image) : [];

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết Người Dùng</h2>
      <div className="mb-4">
        <strong>Tên Người Dùng:</strong> {user.user.name}
      </div>
      <div className="mb-4">
        <strong>Số Điện Thoại:</strong> {user.shipping_address.phone}
      </div>
      <div className="mb-4">
        <strong>Địa chỉ:</strong> {user.shipping_address.address}
      </div>
      <div className="mb-4">
        <strong>Email:</strong> {user.user.email}
      </div>
      <div className="mb-4">
        <strong>Vai Trò:</strong> {user.user.role}
      </div>
      
      <div className="mb-4">
        <strong>Hình Ảnh:</strong>
        <div className="flex space-x-4">
          {images.length > 0 ? (
            images.map((img, index) => (
              <img
                key={index}
                src={urlImage + img}
                alt={user.user.name}
                className="mt-2 w-48 h-48 object-cover"
              />
            ))
          ) : (
            <div>Không có hình ảnh nào</div>
          )}
        </div>
      </div>
      <div className="mb-4">
            <strong>Ngày tạo:</strong> {formatDate(user.user.created_at)}
          </div>
          <div className="mb-4">
            <strong>Ngày cập nhật:</strong> {formatDate(user.user.updated_at)}
          </div>
      <div className="mb-4">
        <strong>Trạng Thái:</strong> {user.user.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
      </div>
      <Link to="/admin/user" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Quay lại
      </Link>
    </div>
  );
};

export default ShowUser;
