import React, { useState } from "react";
import BannerService from "../../../services/Bannerservice"; // Import service để gọi API
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const BannerAdd = () => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [images, setImages] = useState([]);
  const [sortOrder, setSortOrder] = useState(1);

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất một hình ảnh.");
      return;
    }
    formData.append("name", name);
    formData.append("link", link);
    images.forEach((image) => {
      formData.append("images[]", image);
    });
    formData.append("sort_order", sortOrder);
  
    formData.append("description", description);
    formData.append("status", status);

    try {
      const response = await BannerService.insert(formData);
      console.log("Response from API:", response);
      setMessage("Thêm banner thành công!");
      toast.success("Thêm banner thành công!");
      // Reset form
      setName("");
      setLink("");
      setImages([]);
      setSortOrder(1);
      setDescription("");
      setStatus(1);
    } catch (error) {
      console.error("Error adding banner:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.banners // Lấy lỗi từ trường 'banners'
      ) {
        const errors = error.response.data.banners;
        const errorMessages = Object.values(errors).flat(); // Chuyển đổi các thông báo lỗi thành mảng
        setMessage(`Có lỗi xảy ra: ${errorMessages.join(", ")}`); // Cập nhật thông báo lỗi
        toast.error(`Lỗi: ${errorMessages.join(", ")}`);
      } else {
        setMessage("Có lỗi xảy ra khi thêm banner."); // Thông báo mặc định
        toast.error("Có lỗi xảy ra khi thêm banner.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
      <div className="py-3">
        <Link
          to="/admin/banner"
          className="bg-red-500  text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">Thêm Banner</h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        {/* Hiển thị thông báo */}
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Tên Banner
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Nhập tên banner"
              value={name}
              onChange={(e) => setName(e.target.value)} // Cập nhật state
              required
            />
          </div>

          {/* Link */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="link"
            >
              Liên kết
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="link"
              type="text"
              placeholder="Nhập liên kết (nếu có)"
              value={link}
              onChange={(e) => setLink(e.target.value)} // Cập nhật state
            />
          </div>

          {/* Image */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="images"
            >
              Ảnh Banner
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

          {/* Sort Order */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="sort_order"
            >
              Thứ tự sắp xếp
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sort_order"
              type="number"
              placeholder="Nhập thứ tự sắp xếp"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))} // Chuyển đổi sang số
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Mô tả
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Nhập mô tả (nếu có)"
              value={description}
              onChange={(e) => setDescription(e.target.value)} // Cập nhật state
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
              Thêm Banner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerAdd;
