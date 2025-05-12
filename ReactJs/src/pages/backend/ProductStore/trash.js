import React, { useEffect, useState } from "react";
import ProductStoreservice from "../../../services/ProductStoreservice";
import { MdRestore, MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrashStore = () => {
  const [deletedProducts, setDeletedProducts] = useState([]);

  const fetchDeletedProducts = async () => {
    try {
      const result = await ProductStoreservice.trash();
      setDeletedProducts(result.productstore);
    } catch (error) {
      console.error("Error fetching deleted products:", error);
      toast.error("Lỗi khi tải sản phẩm trong kho.");
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const restoreProduct = async (id) => {
    try {
      await ProductStoreservice.restore(id);
      setDeletedProducts(
        deletedProducts.filter((product) => product.id !== id)
      );
      toast.success("Khôi phục vĩnh viễn sản phẩm trong kho thành công.");
    } catch (error) {
      console.error("Error restoring product:", error);
      toast.error("Khôi phục sản phẩm trong kho thất bại.");
    }
  };

  const permanentlyDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này?")) {
      try {
        await ProductStoreservice.destroy(id);
        setDeletedProducts(
          deletedProducts.filter((product) => product.id !== id)
        );
        toast.success("Xóa vĩnh viễn sản phẩm trong kho thành công.");
      } catch (error) {
        console.error("Error permanently deleting product:", error);
        toast.error("Xóa vĩnh viễn sản phẩm trong kho thất bại.");
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Thùng Rác</h1>
      <div className="py-3">
        <Link
          to="/admin/productstore/add"
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </Link>
      </div>
      <table className="w-full bg-white shadow-md rounded-md table-auto">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="p-4">ID Sản phẩm</th>
            <th className="p-4">Giá Bán</th>
            <th className="p-4">Số lượng</th>
            <th className="p-4">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {deletedProducts.length > 0 ? (
            deletedProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4">{product.id}</td>
                <td className="p-4">{product.price_root}</td>
                <td className="p-4">{product.qty}</td>
                <td className="p-4">
                  <button
                    onClick={() => restoreProduct(product.id)}
                    className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                  >
                    <MdRestore className="inline" /> Khôi phục
                  </button>
                  <button
                    onClick={() => permanentlyDelete(product.id)}
                    className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                  >
                    <MdDeleteForever className="inline" /> Xóa vĩnh viễn
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                Không có sản phẩm nào trong thùng rác.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrashStore;
