import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NewService from "../../../services/Newservice";

const ShowNew = () => {
  const { id } = useParams();
  const [newData, setNewData] = useState(null); // Renamed variable to `newData` to avoid conflicts
  const urlImage = "http://127.0.0.1:8000/images/new/"; // This can be removed if not using images
  
  useEffect(() => {
    const fetchNew = async () => {
      try {
        const result = await NewService.show(id); // Call the API to fetch data
        setNewData(result.new); // Set the data into state
      } catch (error) {
        console.error("Error fetching new:", error);
      }
    };

    fetchNew(); // Fetch data on component mount
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
