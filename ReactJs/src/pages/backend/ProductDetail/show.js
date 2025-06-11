import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductDetailService from "../../../services/ProductDetailservice ";

const ProductdetailShow = () => {
  const { id } = useParams();
  const [productdetail, setProductdetail] = useState(null);
  const urlImage = "http://127.0.0.1:8000/images/";

  useEffect(() => {
    const fetchProductdetail = async () => {
      const result = await ProductDetailService.show(id);
      setProductdetail(result.prodetail);
    };
    fetchProductdetail();
  }, [id]);

  if (!productdetail) {
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
    <section className="w-full h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Chi Tiết Chi Tiết Sản Phẩm
        </h2>

        <div className="grid grid-cols-2 gap-6 text-gray-700 text-lg">
          <div>
            <span className="font-semibold">ID Sản phẩm:</span> {productdetail.product_id}
          </div>
          <div>
            <span className="font-semibold">Tên chi tiết sản phẩm:</span> {productdetail.name}
          </div>
          <div>
            <span className="font-semibold">Màu:</span> 
            <span
              className="inline-block w-5 h-5 ml-2 rounded-full border"
              style={{ backgroundColor: productdetail.color }}
              title={productdetail.color}
            ></span>
            <span className="ml-2 capitalize">{productdetail.color}</span>
          </div>
          <div>
            <span className="font-semibold">Size:</span> {productdetail.size}
          </div>
          <div>
            <span className="font-semibold">Số lượng:</span> {productdetail.qty}
          </div>
          <div>
            <span className="font-semibold">Giá:</span> {productdetail.price_root} VND
          </div>
          <div>
            <span className="font-semibold">Ngày tạo:</span> {formatDate(productdetail.created_at)}
          </div>
          <div>
            <span className="font-semibold">Ngày cập nhật:</span> {formatDate(productdetail.updated_at)}
          </div>
          <div>
            <span className="font-semibold">Người tạo:</span> {productdetail.created_by}
          </div>
          <div>
            <span className="font-semibold">Người cập nhật:</span> {productdetail.updated_by}
          </div>
        </div>

        {/* Nếu có ảnh minh họa */}
        {productdetail.image && (
          <div className="mt-8 text-center">
            <img
              src={urlImage + productdetail.image}
              alt="Ảnh sản phẩm"
              className="inline-block rounded shadow-md w-64 h-auto"
            />
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/admin/productdetail"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductdetailShow;
