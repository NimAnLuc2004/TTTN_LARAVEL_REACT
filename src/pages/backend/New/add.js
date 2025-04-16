import React, { useState } from "react";
import NewService from "../../../services/Newservice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const NewAdd = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);

    try {
      const response = await NewService.insert(formData); 
      toast.success("Thêm mới tin tức thành công!");
      setMessage("Thêm mới tin tức thành công!");
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link
            to="/admin/new"
            className="bg-red-500  text-white px-4 py-2 rounded-md"
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
              onChange={(e) => setTitle(e.target.value)} // Update state
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
              onChange={(e) => setContent(e.target.value)} // Update content state
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
              onChange={(e) => setStatus(Number(e.target.value))} // Convert to number
              required
            >
              <option value="1">Kích hoạt</option>
              <option value="2">Không kích hoạt</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end">
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
