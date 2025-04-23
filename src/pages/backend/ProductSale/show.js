import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductSaleService from "../../../services/ProductSaleservice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowProductSale = () => {
  const { id } = useParams();
  const [productSale, setProductSale] = useState(null);

  useEffect(() => {
    const fetchProductSale = async () => {
      try {
        const result = await ProductSaleService.show(id);
        setProductSale(result.productsale);
        console.log(result);
      } catch (error) {
        console.error("Error fetching product sale details:", error);
        toast.error("Lỗi khi tải thông tin sản phẩm giảm giá.");
      }
    };

    fetchProductSale();
  }, [id]);

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Chi Tiết Sản Phẩm Giảm Giá
        </h1>

        {productSale ? (
          <div className="text-xl space-y-4">
            <div className="justify-between items-center">
              <p className="text-gray-600">
                <strong>ID:</strong> {productSale.id}
              </p>
              <p className="text-gray-600">
                <strong>ID sản phẩm:</strong> {productSale.product_id}
              </p>
            </div>
            <div className="justify-between items-center">
              <p className="text-gray-600">
                <strong>Ngày tạo:</strong> {formatDate(productSale.created_at)}
              </p>
              <p className="text-gray-600">
                <strong>Ngày cập nhật:</strong>{" "}
                {formatDate(productSale.updated_at)}
              </p>
            </div>

            <div className="justify-between items-center">
              <p className="text-gray-600">
                <strong>Ngày bắt đầu:</strong> {productSale.start_date}
              </p>
              <p className="text-gray-600">
                <strong>Ngày kết thúc:</strong>{" "}
                {productSale.end_date}
              </p>
            </div>
            <div className="justify-between items-center">
              <p className="text-gray-600">
                <strong>Người tạo:</strong> {productSale.created_by}
              </p>
              
            </div>
            <div className="justify-between items-center">
              <p className="text-gray-600">
                <strong>Phần trăm giảm giá:</strong>{" "}
                {productSale.discount_percent}%
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/admin/productsale"
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
          >
            Quay lại
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowProductSale;
