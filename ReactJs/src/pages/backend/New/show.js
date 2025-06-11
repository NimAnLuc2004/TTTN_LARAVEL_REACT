import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NewService from "../../../services/Newservice";

const ShowNew = () => {
  const { id } = useParams();
  const [newData, setNewData] = useState(null); 
  const urlImage = "http://127.0.0.1:8000/images/new/"; 
    const placeholderImage = "https://via.placeholder.com/300x200?text=No+Image";

  useEffect(() => {
    const fetchNew = async () => {
      try {
        const result = await NewService.show(id);
   
        // Parse image nếu là chuỗi JSON
        const parsedData = {
          ...result.new,
          image:
            typeof result.new.image === "string"
              ? JSON.parse(result.new.image)
              : result.new.image,
        };
        setNewData(parsedData);
      } catch (error) {
        console.error("Error fetching or parsing new:", error);
      }
    };

    fetchNew();
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

  if (!newData) return <div>Đang tải...</div>;

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết tin tức</h2>
      <div className="mb-4">
        <strong>Tên New:</strong> {newData.title}
      </div>
      <div className="mb-4">
        <strong>Mô tả:</strong> {newData.content}
      </div>
      <div className="mb-4">
        <strong className="block text-gray-700">Hình ảnh:</strong>
        {Array.isArray(newData.image) && newData.image.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newData.image.map((image, index) => (
              <img
                key={index}
                src={`${urlImage}${image}`}
                alt={`${newData.title} - ${index + 1}`}
                className="w-full max-w-xs h-auto object-cover rounded-md shadow-md"
                onError={(e) => (e.target.src = placeholderImage)}
              />
            ))}
          </div>
        ) : (
          <span className="text-gray-500">Không có hình ảnh</span>
        )}
      </div>
      <div className="mb-4">
        <strong>Id chủ đề:</strong> {newData.topic_id}
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(newData.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(newData.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {newData.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {newData.updated_by}
      </div>

      <div className="mb-4">
        <strong>Trạng thái:</strong>{" "}
        {newData.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
      </div>
      <Link
        to="/admin/new"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowNew;
