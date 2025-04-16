import React, { useState, useEffect } from "react";
import BrandService from "../../../services/Brandservice";
import CategoryService from "../../../services/Categoryservice";
import ProductService from "../../../services/Productservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductAdd = () => {
  const [name, setProductName] = useState("");
  const [brand_id, setProductBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [price, setProductPrice] = useState("");
  const [description, setProductDescription] = useState("");
  const [status, setStatus] = useState("1");
  const [brands, setBrands] = useState([]);
  const [category_id, setProductCategory] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setProductCategory((prev) =>
      prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value]
    );
  };
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const result = await BrandService.index();
        setBrands(result.brands);
      } catch (error) {
        console.error("Lỗi khi tải thương hiệu:", error);
        toast.error("Không thể tải danh sách thương hiệu!");
      }
    };
  
    const fetchCategories = async () => {
      try {
        const result = await CategoryService.index();
        setCategories(result.categories);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        toast.error("Không thể tải danh sách danh mục!");
      }
    };
  
    fetchBrands();
    fetchCategories();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!name || !brand_id || category_id.length === 0 || !price) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }


    const product = new FormData();

    // Hình ảnh
    const inputImage_url = document.getElementById("productImage");
    const image_urlFile = inputImage_url.files;
    console.log(image_urlFile);
    if (image_urlFile.length === 0) {
      alert("Vui lòng chọn ít nhất một hình ảnh cho sản phẩm.");
      return;
    }

    if (image_urlFile.length > 0) {
      for (let i = 0; i < image_urlFile.length; i++) {
        product.append("image_url[]", image_urlFile[i]);
      }
    }

    // Các thông tin khác của sản phẩm
    product.append("name", name);
    product.append("description", description);
    product.append("status", status);
    product.append("category_id", JSON.stringify(category_id));
    product.append("brand_id", brand_id);
    product.append("price", price);

    try {
      console.log(product)
      const result = await ProductService.insert(product);
      console.log(result);
      toast.success("Sản phẩm đã được thêm thành công!");
      setProductName("");
      setProductPrice("");
      setProductDescription("");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm!");
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
        <h1 className="text-3xl font-bold mb-6 text-center">Thêm Sản Phẩm</h1>
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Tên sản phẩm */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Tên sản phẩm
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          {/* Thương hiệu */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="brand_id"
            >
              Thương hiệu
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="brand_id"
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
              {category_id.length > 0
                ? categories
                    .filter((cat) => category_id.includes(cat.id))
                    .map((cat) => cat.name)
                    .join(", ")
                : "Chọn danh mục"}
              <span className="ml-2">▼</span>
            </div>

            {isCategoryOpen && (
              <div className="absolute w-full bg-white shadow-md border rounded mt-2 p-3 z-10">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                    onClick={() =>
                      handleCategoryChange({ target: { value: category.id } })
                    }
                  >
                    <input
                      type="checkbox"
                      value={category.id}
                      checked={category_id.includes(category.id)}
                      onChange={handleCategoryChange}
                      className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-800">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Giá sản phẩm */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Giá sản phẩm
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              value={price}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Nhập giá sản phẩm"
            />
          </div>

          {/* Mô tả sản phẩm */}
          <div className="col-span-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Mô tả sản phẩm
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              value={description}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className="col-span-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="productImage"
            >
              Ảnh sản phẩm
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="productImage"
              type="file"
              multiple
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status"
            >
              Trạng thái
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="1">Kích hoạt</option>
              <option value="2">Không kích hoạt</option>
            </select>
          </div>

          {/* Nút thêm sản phẩm */}
          <div className="col-span-2 flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductAdd;
