import React, { useState } from "react";
import BrandService from "../../../services/Brandservice"; // Import service để gọi API
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const BrandAdd = () => {
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState(""); // Thông báo thành công hoặc lỗi

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (images.length === 0) {
      alert("Vui lòng chọn ít nhất một hình ảnh.");
      return;
    }
    formData.append("name", name);

    images.forEach((image) => {
      formData.append("images[]", image); // Gửi mảng ảnh
    });

    formData.append("description", description);
    formData.append("status", status);

    try {
      const response = await BrandService.insert(formData);

      if (response.status) {
      setMessage("Thêm brand thành công!");
      toast.success("Thêm brand thành công!", { position: "top-right" });
      // Reset form
      setName("");

      setImages([]);

      setDescription("");
      setStatus(1);
      }
      else{
        toast.error(response.message)
      }
    } catch (error) {
      console.error("Error adding brand:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.brands // Lấy lỗi từ trường 'brands'
      ) {
        const errors = error.response.data.brands;
        const errorMessages = Object.values(errors).flat(); // Chuyển đổi các thông báo lỗi thành mảng
        setMessage(`Có lỗi xảy ra: ${errorMessages.join(", ")}`); // Cập nhật thông báo lỗi
        toast.error(`Có lỗi xảy ra: ${errorMessages.join(", ")}`, { position: "top-right" });
      } else {
        setMessage("Có lỗi xảy ra khi thêm brand."); // Thông báo mặc định
        toast.error("Có lỗi xảy ra khi thêm brand.", { position: "top-right" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
      <div className="py-3">
        <Link
          to="/admin/brand"
          className="bg-red-500  text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">Thêm Thương hiệu</h1>
       

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        {/* Hiển thị thông báo */}
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Tên Thương hiệu
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Nhập tên Thương hiệu"
              value={name}
              onChange={(e) => setName(e.target.value)} // Cập nhật state
              required
            />
          </div>

          {/* Image */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="images"
            >
              Ảnh Thương hiệu
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
              Thêm Thương hiệu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandAdd;
