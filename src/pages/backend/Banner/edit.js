import React, { useState, useEffect } from "react";
import BannerService from "../../../services/Bannerservice"; 
import { Link, useParams } from "react-router-dom"; 
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const BannerEdit = () => {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [images, setImages] = useState([]);
  const [sortOrder, setSortOrder] = useState(1);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  // Fetch banner data khi component được mount
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const result = await BannerService.show(id); // Gọi API để lấy dữ liệu banner
        const bannerData = result.banners;

        // Gán các giá trị từ banner vào state
        setName(bannerData.name || "");
        setLink(bannerData.link || "");
        setSortOrder(bannerData.sort_order || 1);
        setDescription(bannerData.description || "");
        setStatus(bannerData.status || 1);
      } catch (error) {
        console.error("Error fetching banner:", error);
        toast.error("Lỗi khi tải dữ liệu banner!");
      }
    };

    fetchBanner();
  }, [id]);

  // Submit để sửa banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("link", link);
    images.forEach((image) => {
      formData.append("images[]", image);
    });
    formData.append("sort_order", sortOrder);

    formData.append("description", description);
    formData.append("status", status);

    try {
      const response = await BannerService.update( formData,id); // Gọi API để update banner
      console.log("Response from API:", response);
      setMessage("Sửa banner thành công!");
      toast.success("Sửa banner thành công!");
    } catch (error) {
      console.error("Error updating banner:", error);
      setMessage("Có lỗi xảy ra khi sửa banner.");
      toast.error("Có lỗi xảy ra khi sửa banner.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link
            to="/admin/banner"
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Quay lại
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">Sửa Banner</h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Tên Banner */}
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
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setLink(e.target.value)}
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
              onChange={(e) => setImages(Array.from(e.target.files))}
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
              onChange={(e) => setSortOrder(Number(e.target.value))}
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
              onChange={(e) => setDescription(e.target.value)}
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
              Sửa Banner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerEdit;
