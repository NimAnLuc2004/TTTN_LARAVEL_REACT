import React, { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { FaToggleOn, FaToggleOff, FaEdit, FaTrash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ContactService from "../../../services/Contactservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await ContactService.index(page);
        setContacts(response.contacts.data ?? []);

        setLastPage(response.contacts.last_page);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
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
      const allIds = filteredContacts.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredContacts = contacts.filter((item) => {
    const name = item.name ? item.name.toString() : "";
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
  const sortedContacts = [...filteredContacts].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các liên hệ đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => ContactService.delete(id)));
        setContacts((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách liên hệ thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) {
      try {
        await ContactService.delete(id); // Gọi API để xóa contact
        setContacts(contacts.filter((contact) => contact.id !== id)); // Cập nhật state để loại bỏ contact đã xóa
        toast.success("Xóa liên hệ thành công!");
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Lỗi khi xóa liên hệ!");
      }
    }
  };
  const handleStatus = async (id) => {
    try {
      await ContactService.status(id);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id
            ? { ...contact, status: contact.status === 1 ? 0 : 1 }
            : contact
        )
      );
      toast.info("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Lỗi khi cập nhật trạng thái!");
    }
  };
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Liên hệ</p>
      </div>
      {/* search vs delete */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên liên hệ..."
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
        <h2 className="text-lg font-semibold mb-4">Danh sách Liên hệ</h2>
        <Link to={`/admin/contact/trash`}>
          <button className="bg-red-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaTrash className="inline" /> Thùng rác
          </button>
        </Link>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredContacts.length > 0 &&
                    selectedIds.length === filteredContacts.length
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
                Tiêu đề{" "}
                {sortConfig.key === "title" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Tên người liên hệ{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("user_id")}
              >
                Id người liên hệ{" "}
                {sortConfig.key === "user_id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedContacts.length > 0 ? (
              sortedContacts.map((contact) => {
                const jsxStatus =
                  contact.status === 1 ? (
                    <button
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      onClick={() => handleStatus(contact.id)}
                    >
                      <FaToggleOn className="inline" />
                      Đang hoạt động
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      onClick={() => handleStatus(contact.id)}
                    >
                      <FaToggleOff className="inline" />
                      Không hoạt động
                    </button>
                  );

                return (
                  <tr key={contact.id} className="border-b">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(contact.id)}
                        onChange={() => handleCheckboxChange(contact.id)}
                      />
                    </td>
                    <td className="p-4">{contact.id}</td>
                    <td className="p-4">{contact.title}</td>
                    <td className="p-4">{contact.name}</td>
                    <td className="p-4">{contact.user_id}</td>

                    <td className="p-4">{jsxStatus}</td>
                    <td className="p-4">
                      <Link
                        to={`/admin/contact/show/${contact.id}`}
                        className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem
                      </Link>
                      <Link
                        to={`/admin/contact/edit/${contact.id}`}
                        className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaEdit className="inline" /> Chỉnh sửa
                      </Link>
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleDelete(contact.id)}
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
                  <p className="text-lg font-semibold">Không có liên hệ nào.</p>
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

export default ContactList;
