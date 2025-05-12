import React, { useEffect, useState } from "react";
import BrandService from "../../../services/Brandservice"; // Import service để gọi API
import { Link, useParams } from "react-router-dom"; // Lấy id từ URL
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BrandEdit = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [name, setName] = useState("");
  const [images, setImages] = useState([]); // Hình ảnh mới
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");

  // Fetch brand data khi component được mount
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const result = await BrandService.show(id); // Gọi API để lấy dữ liệu thương hiệu
        const brandData = result.brands;

        // Gán các giá trị từ thương hiệu vào state
        setName(brandData.name || "");
        setImages(JSON.parse(brandData.image) || []); // Giả định hình ảnh là một JSON string
        setDescription(brandData.description || "");
        setStatus(brandData.status || 1);
      } catch (error) {
        console.error("Error fetching brand:", error);
        setMessage("Có lỗi xảy ra khi tải thương hiệu.");
      }
    };

    fetchBrand();
  }, [id]);

  // Submit để sửa thương hiệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);


    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("images[]", image); 
      });
    }

    formData.append("description", description);
    formData.append("status", status);

    try {
      const response = await BrandService.update(formData, id); // Gọi API để update thương hiệu
      if (response.status) {
      toast.success("Cập nhật thương hiệu thành công!");
      setMessage("Cập nhật thương hiệu thành công!");
      }
      else{
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      if (error.response && error.response.data && error.response.data.brands) {
        const errors = error.response.data.brands;
        const errorMessages = Object.values(errors).flat(); // Chuyển đổi các thông báo lỗi thành mảng
        setMessage(`Có lỗi xảy ra: ${errorMessages.join(", ")}`); // Cập nhật thông báo lỗi
         toast.error(`Có lỗi xảy ra: ${errorMessages}`);
      } else {
        setMessage("Có lỗi xảy ra khi sửa thương hiệu."); // Thông báo mặc định
        toast.error("Có lỗi xảy ra khi sửa thương hiệu.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link to="/admin/brand" className="bg-red-500 text-white px-4 py-2 rounded-md">
            Quay lại
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">Chỉnh Sửa Thương Hiệu</h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Tên Thương Hiệu
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Nhập tên thương hiệu"
              value={name}
              onChange={(e) => setName(e.target.value)} // Cập nhật state
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
              Ảnh Thương Hiệu
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setImages(Array.from(e.target.files))} 
            />
          </div>

      

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Mô Tả
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
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
              Cập Nhật Thương Hiệu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandEdit;
