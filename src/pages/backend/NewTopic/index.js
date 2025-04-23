import React, { useState, useEffect } from "react";
import NewTopicService from "../../../services/NewTopicservice";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewTopicAdd = () => {
  const [name, setName] = useState("");
  const [newTopic, setNewTopic] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchAllTopics = async () => {
    try {
      const result = await NewTopicService.index();
      setNewTopic(result?.topic || []);
    } catch (error) {
      console.error("Lỗi khi load danh sách:", error);
      toast.error("Lỗi khi tải danh sách chủ đề.");
    }
  };

  useEffect(() => {
    fetchAllTopics();
  }, []);

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Vui lòng nhập tên chủ đề.");
      return;
    }

    const data = { name };

    try {
      const result = await NewTopicService.insert(data);
      if (result.status) {
        toast.success("Thêm chủ đề thành công!");
        setName("");
        fetchAllTopics();
      } else {
        toast.error("Thêm thất bại, thử lại sau.");
      }
    } catch (error) {
      console.error("Lỗi thêm chủ đề:", error);
      toast.error("Lỗi kết nối máy chủ.");
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info("Chưa chọn mục nào để xóa.");
      return;
    }

    if (window.confirm("Bạn có chắc muốn xóa các chủ đề đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => NewTopicService.destroy(id)));
        setNewTopic((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        toast.success("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        toast.error("Xóa thất bại!");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa chủ đề này?")) {
      try {
        await NewTopicService.delete(id);
        setNewTopic((prev) => prev.filter((item) => item.id !== id));
        toast.success("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        toast.error("Xóa thất bại!");
      }
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý chủ đề</p>
      </div>

      <div className="bg-white shadow-md rounded-md p-6 w-1/2 mb-6">
        <h2 className="text-xl font-bold mb-4">Thêm Chủ Đề Mới</h2>
        <form onSubmit={handleAddTopic} className="flex gap-4">
          <input
            type="text"
            placeholder="Nhập tên chủ đề..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm
          </button>
        </form>
      </div>

      <div className="mb-4 flex justify-between">
        <h2 className="text-lg font-semibold">Danh sách chủ đề</h2>
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white py-1 px-3 rounded-md"
        >
          <MdDelete className="inline" /> Xóa đã chọn
        </button>
      </div>

      <table className="w-full bg-white shadow-md rounded-md table-auto">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedIds(e.target.checked ? newTopic.map((t) => t.id) : [])
                }
                checked={
                  selectedIds.length === newTopic.length && newTopic.length > 0
                }
              />
            </th>
            <th className="px-4 py-2">Tên Chủ Đề</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {newTopic.map((topic) => (
            <tr key={topic.id} className="border-t">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(topic.id)}
                  onChange={() => handleCheckboxChange(topic.id)}
                />
              </td>
              <td className="px-4 py-2">{topic.name}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(topic.id)}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default NewTopicAdd;
