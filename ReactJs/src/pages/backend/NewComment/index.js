import React, { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";

import { MdDelete } from "react-icons/md";
import NewCommentService from "../../../services/NewCommentservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const NewCommentList = () => {
  const [newcomments, setNewComments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [lastPage, setLastPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;

  // Fetch newcomments from API
  useEffect(() => {
    const fetchNewComments = async () => {
      try {
        const response = await NewCommentService.index(page);
        setNewComments(response.newcoms.data??[]);
        setLastPage(response.newcoms.last_page);

      } catch (error) {
        console.error("Error fetching newcomments:", error);
      }
    };

    fetchNewComments();
  }, [page]);
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa newcomment này?")) {
      try {
        await NewCommentService.destroy(id); // Gọi API để xóa newcomment
        setNewComments(newcomments.filter((newcomment) => newcomment.id !== id)); // Cập nhật state để loại bỏ newcomment đã xóa
        toast.success("Xóa bình luận thành công!");
      } catch (error) {
        console.error("Error deleting newcomment:", error);
        toast.error("Lỗi khi xóa bình luận!");
      }
    }
  };
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
      const allIds = filteredNewComments.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredNewComments = newcomments.filter((item) => {
    const name = item.user_id ? item.user_id.toString() : "";
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
  const sortedNewComments = [...filteredNewComments].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các bình luận đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => NewCommentService.destroy(id)));
        setNewComments((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách bình luận thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Bình luận</p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo id người bình luận..."
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
        <h2 className="text-lg font-semibold mb-4">Danh sách Bình luận</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredNewComments.length > 0 &&
                    selectedIds.length === filteredNewComments.length
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
                onClick={() => handleSort("user_id ")}
              >
                Id người bình luận{" "}
                {sortConfig.key === "user_id " &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("news_id")}
              >
                Id tin tức{" "}
                {sortConfig.key === "news_id " &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedNewComments.length > 0 ? (
              sortedNewComments.map((newcomment) => {
                return (
                  <tr key={newcomment.id} className="border-b">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(newcomment.id)}
                        onChange={() => handleCheckboxChange(newcomment.id)}
                      />
                    </td>
                    <td className="p-4">{newcomment.id}</td>
                    <td className="p-4">{newcomment.user_id}</td>
                    <td className="p-4">{newcomment.news_id}</td>
                    <td className="p-4">
                      <Link
                        to={`/admin/newcomment/showuser/${newcomment.user_id}`}
                        className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem bình luận khách hàng
                      </Link>
                      <Link
                        to={`/admin/newcomment/shownew/${newcomment.news_id}`}
                        className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem bình luận tin tức
                      </Link>
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleDelete(newcomment.id)}
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
                    Không có bình luận nào.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default NewCommentList;
