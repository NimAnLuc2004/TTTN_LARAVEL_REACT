import React, { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";

import { MdDelete } from "react-icons/md";
import MessageService from "../../../services/Messageservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [lastPage, setLastPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await MessageService.index(page);
   
        setMessages(response.message.data ?? []);
        setLastPage(response.message.last_page);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [page]);
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa message này?")) {
      try {
        await MessageService.destroy(id); // Gọi API để xóa message
        setMessages(messages.filter((message) => message.id !== id)); // Cập nhật state để loại bỏ message đã xóa
        toast.success("Xóa tin nhắn thành công!");
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Lỗi khi xóa tin nhắn!");
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
      const allIds = filteredMessages.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredMessages = messages.filter((item) => {
    const name = item.chat_id ? item.chat_id.toString() : "";
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
  const sortedMessages = [...filteredMessages].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các tin nhắn đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => MessageService.destroy(id)));
        setMessages((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách tin nhắn thành công!");
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
        <p className="text-sm text-gray-500">Home / Quản lý Tin nhắn</p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo id người chat..."
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
        <h2 className="text-lg font-semibold mb-4">Danh sách Tin nhắn</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredMessages.length > 0 &&
                    selectedIds.length === filteredMessages.length
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
                onClick={() => handleSort("chat_id ")}
              >
                Id Chat{" "}
                {sortConfig.key === "chat_id " &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("sender_id ")}
              >
                Id người gửi{" "}
                {sortConfig.key === "sender_id " &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedMessages.length > 0 ? (
              sortedMessages.map((message) => {
                return (
                  <tr key={message.id} className="border-b">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(message.id)}
                        onChange={() => handleCheckboxChange(message.id)}
                      />
                    </td>
                    <td className="p-4">{message.id}</td>
                    <td className="p-4">{message.chat_id}</td>
                    <td className="p-4">{message.sender_id}</td>
                    <td className="p-4">
                      <Link
                        to={`/admin/message/show/${message.id}`}
                        className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem
                      </Link>
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleDelete(message.id)}
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
                    Không có tin nhắn nào.
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

export default MessageList;
