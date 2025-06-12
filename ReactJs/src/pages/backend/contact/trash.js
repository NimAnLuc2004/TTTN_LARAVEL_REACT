import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContactService from "../../../services/Contactservice";
import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactTrash = () => {
  const [deletedContacts, setDeletedContacts] = useState([]);

  useEffect(() => {
    const fetchDeletedContacts = async () => {
      try {
        const response = await ContactService.trash();
        setDeletedContacts(response.contacts);

      } catch (error) {
        console.error("Error fetching deleted contacts:", error);
        toast.error("Lỗi khi tải danh sách liên hệ!");
      }
    };

    fetchDeletedContacts();
  }, []);

  const handleRestore = async (id) => {
    try {
      await ContactService.restore(id); 
      setDeletedContacts(deletedContacts.filter((contact) => contact.id !== id)); // Loại bỏ liên hệ đã khôi phục
      toast.success("Khôi phục liên hệ thành công!");
    } catch (error) {
      console.error("Error restoring contact:", error);
      toast.error("Lỗi khi khôi phục liên hệ!");
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn contact này?")) {
      try {
        await ContactService.destroy(id); // Gọi API để xóa vĩnh viễn
        setDeletedContacts(deletedContacts.filter((contact) => contact.id !== id)); // Loại bỏ liên hệ đã xóa vĩnh viễn
        toast.success("Xóa vĩnh viễn liên hệ thành công!");
      } catch (error) {
        console.error("Error permanently deleting contact:", error);
        toast.error("Lỗi khi xóa liên hệ!");
      }
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Liên hệ / Thùng rác</p>
      </div>

      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Thùng rác Liên hệ</h2>
        <Link to="/admin/contact" className="bg-blue-500 px-3 text-white text-sm py-2 rounded-md">
          Quay lại
        </Link>
        <table className="w-full table-auto mt-4">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4">#</th>
              <th className="p-4">Id Người dùng</th>
              <th className="p-4">Tên Liên Hệ</th>
              <th className="p-4">Tên người liên hệ</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {deletedContacts.length > 0 ? (
              deletedContacts.map((contact) => (
                <tr key={contact.id} className="border-b">
                  <td className="p-4 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-4">{contact.user_id}</td>
                  <td className="p-4">{contact.name}</td>
                  <td className="p-4">{contact.username}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRestore(contact.id)}
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrashRestore className="inline" /> Khôi phục
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(contact.id)}
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <FaTrash className="inline" /> Xóa vĩnh viễn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Không có liên hệ nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ContactTrash;
