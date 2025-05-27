import React, { useEffect, useState } from "react";
import NewService from "../../../services/Newservice";
import { FaTrash, FaTrashRestore, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewTrash = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    (async () => {
      try {
        const result = await NewService.trash(); 
        if (result && result.new && result.new.length > 0) {
          setNewsItems(result.new);
        } else {
          setNewsItems([]);
        }
      } catch (error) {
        setError("Không thể tải danh sách tin tức. Vui lòng thử lại!");
        console.error("Lỗi khi lấy dữ liệu tin tức:", error);
        setNewsItems([]);
      }
    })();
  }, []);

  // Restore deleted item
  const handleRestore = async (id) => {
    try {
      await NewService.restore(id); // API call to restore the item
      setNewsItems(newsItems.filter((item) => item.id !== id)); // Remove from list after restore
      toast.success("Khôi phục tin tức thành công!");
    } catch (error) {
      console.error("Error restoring item:", error);
      toast.warning("Không thể khôi phục tin tức!");
    }
  };

  // Permanently delete item
  const handleDeletePermanently = async (id) => {
    try {
      await NewService.destroy(id); // API call to permanently delete the item
      setNewsItems(newsItems.filter((item) => item.id !== id)); // Remove from list after permanent deletion
      toast.success("Xóa vĩnh viễn tin tức thành công!");
    } catch (error) {
      console.error("Error deleting item permanently:", error);
      toast.error("Lỗi khi xóa tin tức vĩnh viễn!");
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Tin tức / Thùng rác</p>
      </div>

      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách Tin tức trong Thùng rác</h2>
        <Link to={"/admin/new"}>
          <button className="bg-blue-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            Quay lại Danh sách
          </button>
        </Link>

        {/* Show error message */}
        {error ? (
          <div className="text-red-500 text-center font-semibold">{error}</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-4">#</th>
                <th className="p-4">Tiêu đề</th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {newsItems.length > 0 ? (
                newsItems.map((newsItem, index) => (
                  <tr key={newsItem.id} className="border-b">
                    <td className="p-4 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="p-4">{newsItem.title}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleRestore(newsItem.id)}
                        className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaTrashRestore className="inline" /> Khôi phục
                      </button>
                      <button
                        onClick={() => handleDeletePermanently(newsItem.id)}
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaTrash className="inline" /> Xóa vĩnh viễn
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center bg-gray-100 text-gray-500 rounded-md"
                  >
                    <p className="text-lg font-semibold">
                      Không có tin tức nào trong thùng rác.
                    </p>
                    <p className="text-sm">
                      Các tin tức đã xóa sẽ hiển thị tại đây. Hãy khôi phục hoặc xóa vĩnh viễn.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default NewTrash;
