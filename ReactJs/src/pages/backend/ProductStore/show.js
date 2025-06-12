import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductStoreservice from "../../../services/ProductStoreservice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ShowProductStore = () => {
  const { id } = useParams();
  const [productStore, setProductStore] = useState(null);

  useEffect(() => {
    const fetchProductStore = async () => {
      try {
        const result = await ProductStoreservice.show(id);
        setProductStore(result.productstore);
  
      } catch (error) {
        console.error("Error fetching product store details:", error);
        toast.error("Lỗi khi tải sản phẩm trong kho.");
      }
    };

    fetchProductStore();
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
          Chi Tiết Sản Phẩm
        </h1>

        {productStore ? (
          <div className="text-xl space-y-4">
            <div className=" justify-between items-center">
              <p className="text-gray-600">
                <strong>ID:</strong> {productStore.id}
              </p>
              <p className="text-gray-600">
                <strong>ID sản phẩm:</strong> {productStore.product_id}
              </p>
            </div>
            <div className=" justify-between items-center">
              <p className="text-gray-600">
                <strong>Ngày tạo:</strong> {formatDate(productStore.created_at)}
              </p>
              <p className="text-gray-600">
                <strong>Ngày cập nhật:</strong>{" "}
                {formatDate(productStore.updated_at)}
              </p>
            </div>
            <div className=" justify-between items-center">
              <p className="text-gray-600">
                <strong>Người tạo:</strong> {productStore.created_by}
              </p>
              <p className="text-gray-600">
                <strong>Người cập nhật:</strong>
                {productStore.updated_by}
              </p>
            </div>
            <div className=" justify-between items-center">
              <p className="text-gray-600">
                <strong>Giá Bán:</strong> {productStore.price_root}
              </p>
              <p className="text-gray-600">
                <strong>Số lượng:</strong> {productStore.qty}
              </p>
            </div>

            <div>
              <strong className="text-gray-700">Trạng thái:</strong>{" "}
              <span
                className={`font-semibold ${
                  productStore.status === 1 ? "text-green-500" : "text-red-500"
                }`}
              >
                {productStore.status === 1
                  ? "Đang hoạt động"
                  : "Không hoạt động"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/admin/productstore/add"
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
          >
            Quay lại
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowProductStore;
