import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductService from "../../../services/Productservice";

const ProductShow = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const urlImage = "http://127.0.0.1:8000/images/";

  useEffect(() => {
    const fetchProduct = async () => {
      const result = await ProductService.show(id);
      setProduct(result.product);
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="text-center text-xl font-semibold mt-10">Đang tải...</div>
    );
  }
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  return (
    <section className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Chi Tiết Sản Phẩm
        </h2>
        <div className="grid grid-cols-2 gap-6 text-lg">
          <div>
            <strong>Tên sản phẩm:</strong> {product.name}
          </div>
          <div>
            <strong>Danh mục:</strong>{" "}
            {product.categories && Array.isArray(product.categories)
              ? product.categories.map((category) => category.name).join(", ")
              : product.categories?.name || "Không có"}
          </div>
          <div>
            <strong>Thương hiệu:</strong> {product.brand?.name || "Không có"}
          </div>
          <div>
            <strong>Giá:</strong> {product.price.toLocaleString()} VND
          </div>
          <div className="col-span-2">
            <strong>Mô tả:</strong> {product.description}
          </div>
          <div className="mb-4">
            <strong>Ngày tạo:</strong> {formatDate(product.created_at)}
          </div>
          <div className="mb-4">
            <strong>Ngày cập nhật:</strong> {formatDate(product.updated_at)}
          </div>
          <div className="col-span-2">
            <strong>Ảnh sản phẩm:</strong>
            {product.images && product.images.length > 0 ? (
              <img
                className="w-48 h-48 object-cover mt-4 rounded-lg border"
                src={`${urlImage}product/${product.images[0].image_url}`}
                alt="Ảnh sản phẩm"
              />
            ) : (
              <p className="text-gray-500">Không có ảnh</p>
            )}
          </div>
          <div>
            <strong>Trạng thái:</strong>{" "}
            {product.status === 1 ? "Kích hoạt" : "Không kích hoạt"}
          </div>
          <div className="col-span-2 flex justify-center space-x-4 mt-6">
            <Link
              to={`/admin/product/edit/${product.id}`}
              className="bg-blue-500 px-6 py-3 text-white rounded-md hover:bg-blue-600 transition"
            >
              Chỉnh sửa
            </Link>
            <Link
              to="/admin/product"
              className="bg-gray-500 px-6 py-3 text-white rounded-md hover:bg-gray-600 transition"
            >
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShow;
