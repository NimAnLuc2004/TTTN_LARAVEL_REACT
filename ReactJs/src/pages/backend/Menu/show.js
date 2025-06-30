import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MenuService from "../../../services/Menuservice";

const ShowMenu = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);


  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const result = await MenuService.show(id); 
        setMenu(result.menu);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
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
  if (!menu) return <div>Đang tải...</div>; 


  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết chủ đề</h2>
      <div className="mb-4">
        <strong>Tên chủ đề:</strong> {menu.name}
      </div>
      <div className="mb-4">
        <strong>Liên Kết:</strong> {menu.link}
      </div>
      <div className="mb-4">
        <strong>Kiểu:</strong> {menu.type}
      </div>
      <div className="mb-4">
        <strong>Vị trí:</strong> {menu.position}
      </div>
      <div className="mb-4">
        <strong>Id trong bảng:</strong> {menu.table_id}
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(menu.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(menu.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {menu.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {menu.updated_by}
      </div>
      <div className="mb-4">
        <strong>Trạng thái:</strong>{" "}
        {menu.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
      </div>
      <Link to="/admin/menu" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Quay lại
      </Link>
    </div>
  );
};

export default ShowMenu;
