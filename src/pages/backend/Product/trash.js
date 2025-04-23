import React, { useState, useEffect } from "react";
import ProductService from "../../../services/Productservice";
import { FaTrashRestore } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const ProductTrash = () => {
  const [trashProducts, setTrashProducts] = useState([]);

  useEffect(() => {
    const fetchTrashProducts = async () => {
      try {
        const result = await ProductService.trash();
        setTrashProducts(result.products);
      } catch (error) {
        toast.error("Lỗi khi tải sản phẩm!");
      }
    };
    fetchTrashProducts();
  }, []);

  // Khôi phục sản phẩm
  const handleRestore = async (id) => {
    try {
      await ProductService.restore(id);
      setTrashProducts(trashProducts.filter((product) => product.id !== id));
      toast.success("Sản phẩm đã được khôi phục!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Lỗi khi khôi phục sản phẩm!");
    }
  };

  // Xóa vĩnh viễn sản phẩm
  const handlePermanentDelete = async (id) => {
    try {
      await ProductService.destroy(id);
      setTrashProducts(trashProducts.filter((product) => product.id !== id));
      toast.success("Sản phẩm đã bị xóa vĩnh viễn!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm!");
    }
  };

  return (
    <div className="bg-white shadow rounded-md p-4 mb-6">
      <h1 className="text-3xl font-bold mb-6">Thùng Rác Sản Phẩm</h1>
      <Link
        to="/admin/product"
        className="bg-red-500 px-6 py-3 text-white rounded-md hover:bg-red-600 transition"
      >
        Quay lại
      </Link>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="p-4">#</th>
            <th className="p-4">Tên sản phẩm</th>
            <th className="p-4">Giá</th>
            <th className="p-4">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trashProducts.length > 0 ? (
            trashProducts.map((product, index) => (
              <tr key={product.id} className="border-b">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">
                  <button
                    className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md hover:bg-green-600 transition"
                    onClick={() => handleRestore(product.id)}
                  >
                    <FaTrashRestore className="inline" /> Khôi phục
                  </button>
                  <button
                    className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md hover:bg-red-600 transition"
                    onClick={() => handlePermanentDelete(product.id)}
                  >
                    <MdDelete className="inline" /> Xóa vĩnh viễn
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                Không có sản phẩm trong thùng rác.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTrash;
