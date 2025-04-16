import React, { useEffect, useState } from "react";
import CategoryService from "../../../services/Categoryservice"; // Import service để gọi API
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryAdd = () => {
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState(""); // Thông báo thành công hoặc lỗi
  const [categories, setCategories] = useState([]);
  const [parentId, setParentId] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await CategoryService.index(); // Gọi API danh mục
        setCategories(result.categories); // Gán dữ liệu danh mục vào state
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        toast.error("Lỗi khi tải danh mục cha!");
      }
    };

    fetchCategories(); // Gọi API khi component mount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất một hình ảnh.");
      return;
    }
    formData.append("name", name);

    images.forEach((image) => {
      formData.append("images[]", image);
    });

    formData.append("parent_id", parentId);

    formData.append("status", status);

    try {
      const response = await CategoryService.insert(formData);
      console.log("Response from API:", response);
      setMessage("Thêm category thành công!");
      toast.success("Thêm danh mục thành công!");
      // Reset form
      setName("");

      setImages([]);
      setParentId("");

      setStatus(1);
    } catch (error) {
      console.error("Error adding category:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.categorys // Lấy lỗi từ trường 'categorys'
      ) {
        const errors = error.response.data.categorys;
        const errorMessages = Object.values(errors).flat(); // Chuyển đổi các thông báo lỗi thành mảng
        setMessage(`Có lỗi xảy ra: ${errorMessages.join(", ")}`); // Cập nhật thông báo lỗi
        toast.error(`Lỗi: ${errorMessages.join(", ")}`);
      } else {
        setMessage("Có lỗi xảy ra khi thêm category."); // Thông báo mặc định
        toast.error("Có lỗi xảy ra khi thêm danh mục.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link
            to="/admin/category"
            className="bg-red-500  text-white px-4 py-2 rounded-md"
          >
            Quay lại
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">Thêm Danh Mục</h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        {/* Hiển thị thông báo */}
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Tên Danh Mục
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Nhập tên danh mục"
              value={name}
              onChange={(e) => setName(e.target.value)} // Cập nhật state
              required
            />
          </div>
          <div className="col-span-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="parent_id"
            >
              Danh mục cha
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="parent_id"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="0">Danh mục gốc</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {/* Image */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="images"
            >
              Ảnh Danh Mục
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setImages(Array.from(e.target.files))} // Cập nhật state với hình ảnh được chọn
              required
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
              onChange={(e) => setStatus(Number(e.target.value))} // Chuyển đổi sang số
              required
            >
              <option value="1">Kích hoạt</option>
              <option value="2">Không kích hoạt</option>
            </select>
          </div>

          {/* Submit button */}
          <div className="col-span-2 flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Thêm Danh Mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryAdd;
