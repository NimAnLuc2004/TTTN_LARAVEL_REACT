import React, { useEffect, useState } from "react";
import MenuService from "../../../services/Menuservice"; // Giả sử có dịch vụ cho chủ đề
import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MenuTrashList = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchTrashMenus = async () => {
      try {
        const result = await MenuService.trash();
        setMenus(result.menu);
      } catch (error) {
        console.error("Error fetching trash menus:", error);
      }
    };

    fetchTrashMenus();
  }, []);
  const handleRestore = async (id) => {
    try {
      await MenuService.restore(id);
      setMenus(menus.filter((menu) => menu.id !== id));
      toast.success("✅ Khôi phục menu thành công!");
    } catch (error) {
      console.error("Error restoring menu:", error);
      toast.error("❌ Lỗi khi khôi phục menu.");
    }
  };

  const handleDeletePermanently = async (id) => {
    try {
      await MenuService.destroy(id);
      setMenus(menus.filter((menu) => menu.id !== id));
      toast.success("🗑️ Xóa vĩnh viễn menu thành công!");
    } catch (error) {
      console.error("Error deleting menu permanently:", error);
      toast.error("❌ Lỗi khi xóa vĩnh viễn menu.");
    }
  };

  return (
    <div>
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">
          Home / Quản lý Chủ đề / Thùng rác
        </p>
      </div>

      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Danh sách Chủ đề trong Thùng rác
        </h2>
        <Link
          to="/admin/menu"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4">#</th>
              <th className="p-4">Tên Chủ đề</th>
              <th className="p-4">Liên Kết</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {menus.length > 0 ? (
              menus.map((menu) => (
                <tr key={menu.id} className="border-b">
                  <td className="p-4 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-4">{menu.name}</td>
                  <td className="p-4">{menu.link}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRestore(menu.id)}
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrashRestore className="inline" /> Khôi phục
                    </button>
                    <button
                      onClick={() => handleDeletePermanently(menu.id)}
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrash className="inline" /> Xóa vĩnh viễn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  Không có chủ đề nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default MenuTrashList;
