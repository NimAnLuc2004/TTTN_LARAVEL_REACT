import React, { useState, useEffect } from "react";
import ProductService from "../../../services/Productservice";
import ProductDetailService from "../../../services/ProductDetailservice ";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const colors = ["red", "blue", "green", "yellow", "black", "white", "purple"];

const ProductDetailAdd = () => {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState(null);
  const [productList, setProductList] = useState([]);
  const [showProductList, setShowProductList] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [size, setSize] = useState("");
  const [name, setName] = useState(""); // Added name state
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const result = await ProductService.index();
        setProductList(result?.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchAllProducts();
  }, []);

  const handleProductSelect = (id, name) => {
    setProductId(id);
    setProductName(name);
    setShowProductList(false);
  };

  const handleAddProductDetail = async (e) => {
    e.preventDefault();
    const selectedProduct = productList.find((p) => p.id === productId);
    if (!selectedProduct) {
      toast.error("Vui lòng chọn sản phẩm hợp lệ.");
      return;
    }

    if (size.length === 0) {
      toast.warn("Sản phẩm chưa có size. Không thể thêm khuyến mãi.");
      return;
    }

    if (selectedColor.length === 0) {
      toast.warn("Sản phẩm chưa có màu. Không thể thêm khuyến mãi.");
      return;
    }

    if (name.length === 0) {
      toast.warn("Sản phẩm chưa có tên chi tiết. Không thể thêm.");
      return;
    }

    const productDetail = {
      product_id: productId,
      color: selectedColor,
      size,
      name, // Added name to productDetail
      price,
    };
    try {
      const result = await ProductDetailService.insert(productDetail);
      if (result.status) {
        toast.success("Thêm chi tiết sản phẩm thành công!");
        setProductName("");
        setSelectedColor("");
        setSize("");
        setName(""); // Reset name
        setPrice("");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error adding product detail:", error);
      toast.error("Lỗi kết nối với máy chủ!");
    }
  };

  return (
    <div className="flex flex-row bg-gray-100 p-8">
      <div className="basis-1/2 bg-white shadow-md rounded-md p-8">
        <Link
          to="/admin/productdetail"
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-center">
          Thêm Chi Tiết Sản Phẩm
        </h1>

        <form className="grid grid-cols-2 gap-6 relative">
          <div className="relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tên Sản Phẩm
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              value={productName}
              readOnly
              required
            />
            <button
              type="button"
              onClick={() => setShowProductList(true)}
              className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
            >
              Chọn sản phẩm
            </button>
            {showProductList && (
              <ul className="absolute bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto w-full mt-2">
                {productList.map((product) => (
                  <li
                    key={product.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      handleProductSelect(product.id, product.name)
                    }
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Chọn Màu
            </label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color ? "border-black" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(color);
                  }}
                ></button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Size
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tên Chi Tiết
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Giá
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleAddProductDetail}
            >
              Thêm chi tiết sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDetailAdd;