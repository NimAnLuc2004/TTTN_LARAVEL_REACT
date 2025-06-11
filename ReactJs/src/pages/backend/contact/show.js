import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContactService from "../../../services/Contactservice";
import UserService from "../../../services/Userservice";

const ContactShow = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [contact, setContact] = useState(null); 
  const [user, setUser] = useState(null); // State để lưu user

  // Lấy chi tiết liên hệ
  useEffect(() => {
    const fetchContactShow = async () => {
      try {
        const response = await ContactService.show(id); // Gọi API để lấy chi tiết contact
        setContact(response.contact); // Cập nhật state với dữ liệu contact

        // Nếu contact có thông tin user_id thì mới gọi API để lấy chi tiết user
        if (response.contact.user_id) {
          const userResponse = await UserService.show(response.contact.user_id); // Gọi API để lấy chi tiết user
          setUser(userResponse.user); // Cập nhật state với dữ liệu user
        }
      } catch (error) {
        console.error("Error fetching contact detail:", error);
      }
    };

    fetchContactShow();
  }, [id]);

  // Nếu chưa có dữ liệu contact, hiển thị loading
  if (!contact) {
    return <div>Đang tải...</div>;
  }
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
  return (
    <div className="bg-white text-xl shadow rounded-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Chi tiết liên hệ</h2>

      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Tiêu đề:</strong> {contact.title}
        </p>
      </div>
      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Tên liên hệ:</strong> {contact.name}
        </p>
      </div>
      {/* Hiển thị thông tin người dùng nếu có */}
      {user && (
        <div className="mb-4">
          <p className="text-gray-600">
            <strong>Tên người liên hệ:</strong> {user.name}
          </p>
        </div>
      )}
      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Email:</strong> {contact.email}
        </p>
      </div>
      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Số điện thoại:</strong> {contact.phone}
        </p>
      </div>
      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Nội dung liên hệ:</strong> {contact.content}
        </p>
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(contact.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(contact.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {contact.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {contact.updated_by}
      </div>
      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Trạng thái:</strong>{" "}
          {contact.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
        </p>
      </div>
      <Link to="/admin/contact" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Quay lại
      </Link>
    </div>
  );
};

export default ContactShow;
