import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NotificationService from "../../../services/Notificationservice ";

const ShowNotification = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const result = await NotificationService.show(id);
        setNotification(result.noti);
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    };

    fetchNotification(); // Gọi hàm lấy dữ liệu khi component mount
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
  if (!notification) return <div>Đang tải...</div>;

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết thông báo</h2>
      <div className="mb-4">
        <strong>Id User:</strong> {notification.user_id}
      </div>
      <div className="mb-4">
        <strong>Thông báo:</strong> {notification.message}
      </div>
      <div className="mb-4">
        <strong>Quyền:</strong> {notification.role}
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(notification.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(notification.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {notification.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {notification.updated_by}
      </div>
      <Link
        to="/admin/notification"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowNotification;
