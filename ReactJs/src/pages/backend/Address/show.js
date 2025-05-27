import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdressService from "../../../services/Addressservice";

const ShowAdress = () => {
  const { id } = useParams();
  const [adress, setAdress] = useState(null);
  useEffect(() => {
    const fetchAdress = async () => {
      try {
        const result = await AdressService.show(id); 
        setAdress(result.ship);
      } catch (error) {
        console.error("Error fetching adress:", error);
      }
    };

    fetchAdress(); // Gọi hàm lấy dữ liệu khi component mount
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
  if (!adress) return <div>Đang tải...</div>; 

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết địa chỉ</h2>
      <div className="mb-4">
        <strong>Id User:</strong> {adress.user_id}
      </div>
      <div className="mb-4">
        <strong>Địa chỉ:</strong> {adress.address}
      </div>
      <div className="mb-4">
        <strong>Số điện thoại:</strong> {adress.phone}
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(adress.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(adress.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {adress.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {adress.updated_by}
      </div>
      <Link
        to="/admin/address"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowAdress;
