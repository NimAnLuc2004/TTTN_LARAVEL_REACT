import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserService from "../../../services/Userservice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const urlImage = "http://127.0.0.1:8000/images/user/";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await UserService.show(id); // Gọi API để lấy thông tin người dùng
        if (!result.shipping_address || !result.user) {
          toast.warning("Người dùng chưa có địa chỉ, vui lòng cập nhật!");
          navigate(`/admin/user/edit/${id}`);
          return;
        }
        setUser(result);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, [id, navigate]);

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
 const images = Array.isArray(user?.user?.image) && user.user.image.length > 0 
  ? user.user.image 
  : ["default.jpg"];

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h1 className="text-xl font-semibold mb-6 text-center">
        Chi tiết Người Dùng
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
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
            <strong>Trạng Thái:</strong>{" "}
            {user.user.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <strong>Người tạo:</strong> {user.user.created_by}
          </div>
          <div className="mb-4">
            <strong>Người cập nhật:</strong> {user.user.updated_by}
          </div>
          <div className="mb-4">
            <strong>Ngày tạo:</strong> {formatDate(user.user.created_at)}
          </div>
          <div className="mb-4">
            <strong>Ngày cập nhật:</strong> {formatDate(user.user.updated_at)}
          </div>
          <div className="mb-4">
            <strong>Hình Ảnh:</strong>
            <div className="flex flex-wrap gap-4 mt-2">
              {images.length > 0 ? (
                images.map((img, index) => (
                  <img
                    key={index}
                    src={urlImage + img}
                    alt={user.user.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                ))
              ) : (
                <div>Không có hình ảnh nào</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/admin/user"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
      </div>
    </div>
  );
};

export default ShowUser;
