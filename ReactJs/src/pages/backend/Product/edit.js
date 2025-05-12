import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BrandService from "../../../services/Brandservice";
import CategoryService from "../../../services/Categoryservice";
import ProductService from "../../../services/Productservice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setProductName] = useState("");
  const [brand_id, setProductBrand] = useState("");
  const [categories, setCategories] = useState([]);

  const [description, setProductDescription] = useState("");
  const [status, setStatus] = useState("1");
  const [brands, setBrands] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [image_url, setImageUrl] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await ProductService.show(id);
        setProductName(result.product.name);
        setProductBrand(result.product.brand_id);

        setProductDescription(result.product.description);
        setStatus(result.product.status);
        setCategoryId(result.product.category_id || []);
        setExistingImages(result.product.images || []);

      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const result = await BrandService.index();
        setBrands(result.brands);
      } catch (error) {
        console.error("Lỗi khi tải thương hiệu:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const result = await CategoryService.index();
        setCategories(result.categories);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    fetchProduct();
    fetchBrands();
    fetchCategories();
  }, [id]);

  const handleCategoryChange = (e) => {
    const selectedCategory = Number(e.target.value);
    setCategoryId((prev) => {
      if (prev.includes(selectedCategory)) {
        return prev.filter((id) => id !== selectedCategory); // Xóa nếu đã chọn
      } else {
        return [...new Set([...prev, selectedCategory])]; // Đảm bảo không có ID trùng
      }
    });
  };
  const urlImage = "http://127.0.0.1:8000/images/";
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageUrl(files);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !brand_id || categoryId.length === 0 ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || ""); // Handle empty description
    formData.append("status", status);
    formData.append("brand_id", brand_id);
    formData.append("category_id", JSON.stringify(categoryId));
    image_url.forEach((image) => {
      formData.append("image_url[]", image); // Multiple file upload
    });

    try {
      const response = await ProductService.update(id, formData);
    
      if (response.status) {
      toast.success("Sản phẩm đã được cập nhật thành công!");
      navigate("/admin/product");}
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  };

  return (
    <div className="min-h-full flex justify-center bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link
            to="/admin/product"
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Quay lại
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">
          Chỉnh sửa sản phẩm
        </h1>
        <form
          className="grid grid-cols-2 gap-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tên sản phẩm
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={name}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          {/* Thương hiệu */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Thương hiệu
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={brand_id}
              onChange={(e) => setProductBrand(e.target.value)}
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Danh mục */}
          <div className="relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Danh mục
            </label>
            <div
              className="shadow border rounded w-full py-2 px-3 bg-white text-gray-700 cursor-pointer flex justify-between items-center"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              {categoryId.length > 0
                ? categories
                    .filter((cat) => categoryId.includes(cat.id))
                    .map((cat) => cat.name)
                    .join(", ")
                : "Chọn danh mục"}
              <span className="ml-2">▼</span>
            </div>
            {isCategoryOpen && (
              <div className="absolute w-full bg-white shadow-md border rounded mt-2 p-3 z-10 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={category.id}
                      checked={categoryId.includes(category.id)}
                      onChange={handleCategoryChange}
                      className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-800">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Mô tả */}
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mô tả sản phẩm
            </label>
            <textarea
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={description}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Trạng thái
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="1">Kích hoạt</option>
              <option value="2">Không kích hoạt</option>
            </select>
          </div>

          {/* Hình ảnh hiện tại */}
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Hình ảnh hiện tại
            </label>
            <div className="flex gap-4 flex-wrap">
              {existingImages.length > 0 ? (
                existingImages.map((image, index) => (
                  <img
                    key={index}
                    src={
                          urlImage + "product/" + image.image_url
                        }
                    alt="Product"
                    className="w-24 h-24 object-cover rounded"
                  />
                ))
              ) : (
                <p>Không có hình ảnh hiện tại</p>
              )}
            </div>
          </div>

          {/* Tải ảnh mới */}
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tải ảnh mới
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          {/* Nút cập nhật */}
          <div className="col-span-2 flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Cập nhật sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
