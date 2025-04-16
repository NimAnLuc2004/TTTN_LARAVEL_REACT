import React, { useEffect, useState } from "react";
import NewService from "../../../services/Newservice";
import { IoEyeSharp } from "react-icons/io5";
import {
  FaToggleOff,
  FaToggleOn,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const NewList = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  //phân trang
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  useEffect(() => {
    (async () => {
      try {
        const result = await NewService.index(page);
        if (result && result.new.data && result.new.data.length > 0) {
          setNewsItems(result.new.data ?? []);
          setLastPage(result.new.last_page);
        } else {
          setNewsItems([]);
        }
      } catch (error) {
        setError("Không thể tải danh sách tin tức. Vui lòng thử lại!");
        console.error("Lỗi khi lấy dữ liệu tin tức:", error);
        setNewsItems([]);
      }
    })();
  }, [page]);
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredNews.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredNews = newsItems.filter((item) => {
    const name = item.title ? item.title.toString() : "";
    return removeVietnameseTones(name.toLowerCase()).includes(
      removeVietnameseTones(searchTerm.toLowerCase())
    );
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const sortedNews = [...filteredNews].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info("Vui lòng chọn ít nhất một mục để xóa.");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các tin tức đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => NewService.delete(id)));
        setNewsItems((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách tin tức thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };
  // Hàm xóa tin tức
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin tức này?")) {
      try {
        await NewService.delete(id); // Gọi API xóa tin tức
        setNewsItems(newsItems.filter((newsItem) => newsItem.id !== id)); // Changed 'new' to 'newsItem'
        toast.success("Xóa tin tức thành công!");
      } catch (error) {
        console.error("Error deleting new:", error);
        toast.error("Lỗi khi xóa tin tức!");
      }
    }
  };

  // Hàm thay đổi trạng thái hoạt động
  const handleStatus = async (id) => {
    try {
      await NewService.status(id);
      setNewsItems((prevNewsItems) =>
        prevNewsItems.map(
          (
            newsItem // Changed 'new' to 'newsItem'
          ) =>
            newsItem.id === id
              ? { ...newsItem, status: newsItem.status === 1 ? 0 : 1 } // Changed 'new' to 'newsItem'
              : newsItem
        )
      );
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating new status:", error);
      toast.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Tin tức</p>
      </div>
      {/* search vs delete */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tiêu đề tin tức..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="border border-gray-300 px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white py-1 px-3 rounded-md"
        >
          <MdDelete className="inline" /> Xóa đã chọn
        </button>
      </div>
      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách Tin tức</h2>
        <Link to={"/admin/new/add"}>
          <button className="bg-green-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaPlus className="inline" /> Thêm
          </button>
        </Link>
        <Link to={"/admin/new/trash"}>
          <button className="bg-red-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaTrash className="inline" /> Thùng rác
          </button>
        </Link>
        {/* Hiển thị lỗi nếu có */}
        {error ? (
          <div className="text-red-500 text-center font-semibold">{error}</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-4 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredNews.length > 0 &&
                      selectedIds.length === filteredNews.length
                    }
                  />
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  Id{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  Tiêu đề
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>

                <th className="p-4">Trạng thái</th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedNews.length > 0 ? (
                sortedNews.map((newsItem, index) => {
                  const jsxStatus =
                    newsItem.status === 1 ? (
                      <button
                        className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleStatus(newsItem.id)}
                      >
                        <FaToggleOn className="inline" /> Đang hoạt động
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleStatus(newsItem.id)}
                      >
                        <FaToggleOff className="inline" /> Không hoạt động
                      </button>
                    );

                  return (
                    <tr key={newsItem.id} className="border-b">
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(newsItem.id)}
                          onChange={() => handleCheckboxChange(newsItem.id)}
                        />
                      </td>
                      <td className="p-4">{newsItem.id}</td>
                      <td className="p-4">{newsItem.title}</td>
                      <td className="p-4">{jsxStatus}</td>
                      <td className="p-4">
                        <Link
                          to={`/admin/new/show/${newsItem.id}`}
                          className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <IoEyeSharp className="inline" /> Xem
                        </Link>
                        <Link
                          to={`/admin/new/edit/${newsItem.id}`}
                          className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <FaEdit className="inline" /> Chỉnh sửa
                        </Link>
                        <button
                          className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                          onClick={() => handleDelete(newsItem.id)}
                        >
                          <MdDelete className="inline" /> Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-4 text-center bg-gray-100 text-gray-500 rounded-md"
                  >
                    <p className="text-lg font-semibold">
                      Không có tin tức nào.
                    </p>
                    <p className="text-sm">
                      Hãy thêm tin tức mới để hiển thị danh sách.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {/* phân trang */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setSearchParams({ page: page - 1 })}
            disabled={page <= 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Trước
          </button>
          <span>
            {page} / {lastPage}
          </span>
          <button
            onClick={() => setSearchParams({ page: page + 1 })}
            disabled={page >= lastPage}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Sau
          </button>
        </div>
      </section>
    </div>
  );
};

export default NewList;
