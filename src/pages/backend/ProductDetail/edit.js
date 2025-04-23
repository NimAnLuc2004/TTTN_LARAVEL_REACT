import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../../services/Productservice";
import ProductDetailService from "../../../services/ProductDetailservice ";
import { toast } from "react-toastify";

const colors = ["red", "blue", "green", "yellow", "black", "white", "purple"];

const ProductDetailEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productDetail, setProductDetail] = useState(null);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [size, setSize] = useState("");
  const [name, setName] = useState(""); // Added name state
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const result = await ProductDetailService.show(id);
        if (result) {
          setProductDetail(result.prodetail);
          setSelectedProduct(result.prodetail.product_id || "");
          setSelectedColor(result.prodetail.color || "");
          setSize(result.prodetail.size || "");
          setName(result.prodetail.name || ""); // Set name from API
          setPrice(result.prodetail.price || "");
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const result = await ProductService.index();
        setProductList(result?.products || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      }
    };

    fetchProductDetail();
    fetchAllProducts();
  }, [id]);

  const handleUpdateProductDetail = async (e) => {
    e.preventDefault();
    const updatedProductDetail = {
      product_id: selectedProduct,
      color: selectedColor,
      size,
      name, // Added name to updatedProductDetail
      price,
    };

    try {
      const result = await ProductDetailService.update(updatedProductDetail, id);
      if (result.status) {
        toast.success("Cập nhật thành công!");
        navigate("/admin/productdetail");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      toast.error("Lỗi kết nối máy chủ!");
    }
  };

  if (!productDetail) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="flex flex-row bg-gray-100 p-8">
      <div className="basis-1/2 bg-white shadow-md rounded-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Chỉnh Sửa Chi Tiết Sản Phẩm</h1>
        <form className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Chọn Sản Phẩm</label>
            <select
              className="border rounded w-full py-2 px-3"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">Chọn sản phẩm</option>
              {productList.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Chọn Màu</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={

color}
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Size</label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tên Chi Tiết</label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Giá</label>
            <input
              className="border rounded w-full py-2 px-3"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleUpdateProductDetail}
            >
              Cập nhật sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDetailEdit;