import React, { useEffect, useState } from "react";
import CategoryService from "../../../services/Categoryservice";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryEdit = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [name, setName] = useState("");
  const [images, setImages] = useState([]); // Hình ảnh mới
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentId, setParentId] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await CategoryService.index();
      setCategories(result.categories);
    };

    const fetchCategory = async () => {
      try {
        const result = await CategoryService.show(id);
        const category = result.categories;
        console.log(category);

        setName(category.name);
        setImages(JSON.parse(category.image) || []);
        setParentId(
          category.parent_id === category.id || category.parent_id === null
            ? 0
            : category.parent_id
        );
        
        setStatus(category.status);
      } catch (error) {
        console.error("Error fetching category:", error);
        setMessage("Có lỗi xảy ra khi tải danh mục.");
        toast.error("Có lỗi xảy ra khi tải danh mục.");
      }
    };

    fetchCategories();
    fetchCategory();
  }, [id]);

  console.log(parentId);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);

    // Nếu không có hình ảnh mới được tải lên, giữ hình ảnh cũ
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("images[]", image);
      });
    }

    formData.append("parent_id", parentId);
    formData.append("status", status);

    try {
      const response = await CategoryService.update(formData, id);
      if (response.status) {
      setMessage("Cập nhật danh mục thành công!");
      toast.success("Cập nhật danh mục thành công!");
      }
      else{
        toast.error(response.message);
      }
      // Reset các trường sau khi cập nhật thành công (nếu cần)
    } catch (error) {
      console.error("Error updating category:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.categorys
      ) {
        const errors = error.response.data.categorys;
        const errorMessages = Object.values(errors).flat();
        setMessage(`Có lỗi xảy ra: ${errorMessages.join(", ")}`);
        toast.error(`Có lỗi xảy ra: ${errorMessages.join(", ")}`);
      } else {
        setMessage("Có lỗi xảy ra khi cập nhật danh mục.");
        toast.error("Có lỗi xảy ra khi cập nhật danh mục.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link
            to="/admin/category"
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Quay lại
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">
          Chỉnh Sửa Danh Mục
        </h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
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
              onChange={(e) => setName(e.target.value)}
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
              {categories
                .filter((category) => category.id !== parseInt(id)) // Loại bỏ chính danh mục hiện tại
                .map((category) => (
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
              onChange={(e) => setImages(Array.from(e.target.files))}
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

          {/* Submit button */}
          <div className="col-span-2 flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Cập nhật Danh Mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEdit;
