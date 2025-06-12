import React, { useState, useEffect, useRef } from "react";
import NewService from "../../../services/Newservice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import NewTopicService from "../../../services/NewTopicservice";

const NewAdd = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await NewTopicService.index();
        setTopics(res?.topic || []);
      } catch (err) {
        console.error("Lỗi khi load chủ đề:", err);
      }
    };
    fetchTopics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
    formData.append("topic_id", topic);

    for (let i = 0; i < images.length; i++) {
      formData.append("image[]", images[i]);
    }
    try {
      const response = await NewService.insert(formData);
      if (response.status) {
        toast.success("Thêm mới tin tức thành công!");
        setMessage("Thêm mới tin tức thành công!");
        setTitle("");
        setContent("");
        setStatus(1);
        setTopic("");
        setImages([]);
      } else {
        toast.error("Id tin tức không tồn tại.");
      }
    } catch (error) {
      console.error("Error creating new:", error);
      if (error.response && error.response.data && error.response.data.news) {
        const errors = error.response.data.news;
        const errorMessages = Object.values(errors).flat();
        setMessage(`Có lỗi xảy ra: ${errorMessages.join(", ")}`);
        toast.error(`Có lỗi xảy ra: ${errorMessages}`);
      } else {
        setMessage("Có lỗi xảy ra khi thêm tin tức.");
        toast.error("Có lỗi xảy ra khi thêm tin tức.");
      }
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setStatus(1);
    setTopic("");
    setImages([]);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link
            to="/admin/new"
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Quay lại
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">
          Thêm Mới Tin tức
        </h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Tên Tin tức
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Nhập tên tin tức"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content / Description */}
          <div className="col-span-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="content"
            >
              Mô Tả
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="content"
              placeholder="Nhập mô tả (nếu có)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Chủ đề
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">-- Chọn chủ đề --</option>
              {topics.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Ảnh
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setImages(e.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0 file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Status */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status"
            >
              Trạng Thái
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              required
            >
              <option value="1">Kích hoạt</option>
              <option value="2">Không kích hoạt</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Đặt lại
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Thêm Tin tức
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAdd;
