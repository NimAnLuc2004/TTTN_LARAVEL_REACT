import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MessageService from "../../../services/Messageservice";

const ShowMessage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const result = await MessageService.show(id); 
        setMessage(result.message);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage(); // Gọi hàm lấy dữ liệu khi component mount
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
  if (!message) return <div>Đang tải...</div>; // Hiển thị khi chưa có dữ liệu



  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết tin nhắn</h2>
      <div className="mb-4">
        <strong>Id:</strong> {message.id}
      </div>
      <div className="mb-4">
        <strong>Id Chat:</strong> {message.chat_id}
      </div>
      <div className="mb-4">
        <strong>Id người gửi:</strong> {message.sender_id}
      </div>
      <div className="mb-4">
        <strong>Tin nhắn:</strong> {message.message}
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(message.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(message.updated_at)}
      </div>
      <Link
        to="/admin/message"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowMessage;
