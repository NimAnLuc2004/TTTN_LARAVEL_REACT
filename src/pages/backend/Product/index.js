import React, { useEffect, useState } from "react";
import ProductService from "../../../services/Productservice";
import { IoEyeSharp } from "react-icons/io5";
import {
  FaToggleOff,
  FaToggleOn,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    //phân trang
    const [lastPage, setLastPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;
  useEffect(() => {
    (async () => {
      try {
        const result = await ProductService.index(page);
        if (result && result.products.data && result.products.data.length > 0) {
          setProducts(result.products.data??[]);
          setLastPage(result.products.last_page);
        } else {
          setProducts([]);
          toast.info("Danh sách sản phẩm trống!", { autoClose: 2000 });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setError("Không thể tải danh sách thành viên. Vui lòng thử lại!");
        setProducts([]);

        toast.error("Không thể tải danh sách sản phẩm!", { autoClose: 2000 });
      }
    })();
  }, [page]);
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredProducts.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredProducts = products.filter((item) => {
    const name = item.name ? item.name.toString() : "";
    return removeVietnameseTones(name.toLowerCase()).includes(
      removeVietnameseTones(searchTerm.toLowerCase())
    );
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info("Vui lòng chọn ít nhất một mục để xóa.");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => ProductService.delete(id)));
        setProducts((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách sản phẩm thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };
  const urlImage = "http://127.0.0.1:8000/images/";
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await ProductService.delete(id);
        setProducts(products.filter((product) => product.id !== id));
        toast.success("Xóa sản phẩm thành công!", { autoClose: 2000 });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Lỗi khi xóa sản phẩm!", { autoClose: 2000 });
      }
    }
  };

  const handleStatus = async (id) => {
    try {
      await ProductService.status(id);
      setProducts(
        products.map((product) =>
          product.id === id
            ? { ...product, status: product.status === 1 ? 0 : 1 }
            : product
        )
      );
      toast.success("Cập nhật trạng thái thành công!", { autoClose: 2000 });
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Lỗi khi cập nhật trạng thái!", { autoClose: 2000 });
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Sản phẩm</p>
      </div>
  <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="border border-gray-300 px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white py-1 px-3 rounded-md"
        >
          <MdDelete className="inline" /> Xóa đã chọn
        </button>
      </div>
      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h2>
        <button className="bg-green-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
          <Link to={"/admin/product/add"}>
            <FaPlus className="inline" /> Thêm sản phẩm
          </Link>
        </button>
        <Link to={"/admin/product/trash"}>
          <button className="bg-red-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaTrash className="inline" /> Thùng rác
          </button>
        </Link>
        {/* Hiển thị lỗi nếu có */}
        {error ? (
          <div className="text-red-500 text-center font-semibold">{error}</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredProducts.length > 0 &&
                    selectedIds.length === filteredProducts.length
                  }
                />
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("id")}
              >
                Id{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Tên sản phẩm{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Giá{" "}
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
                <th className="p-4">Hình ảnh</th>
                <th className="p-4">Tên danh mục</th>

                <th className="p-4">Tên thương hiệu</th>

                <th className="p-4">Trạng thái</th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => {
                  const jsxStatus =
                    product.status === 1 ? (
                      <button
                        className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleStatus(product.id)}
                      >
                        <FaToggleOn className="inline" /> Đang hoạt động
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleStatus(product.id)}
                      >
                        <FaToggleOff className="inline" /> Không hoạt động
                      </button>
                    );

                  return (
                    <tr key={product.id} className="border-b">
                      <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleCheckboxChange(product.id)}
                      />
                      </td>
                      <td className="p-4">{product.id}</td>
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.price} VND</td>
                      <td className="p-4">
                        <img
                          className="w-16 h-16 object-cover"
                          src={
                            urlImage + "product/" + product.images[0].image_url
                          }
                          alt={product.name}
                        />
                      </td>
                      <td className="p-4">
                        {Array.isArray(product.categories)
                          ? product.categories
                              .map((category) => category.name)
                              .join(", ")
                          : product.categories.name}
                      </td>

                      <td className="p-4">{product.brand.name}</td>
                      <td className="p-4">{jsxStatus}</td>
                      <td className="p-4">
                        <Link
                          to={`/admin/product/show/${product.id}`}
                          className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <IoEyeSharp className="inline" /> Xem
                        </Link>
                        <Link
                          to={`/admin/product/edit/${product.id}`}
                          className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <FaEdit className="inline" /> Chỉnh sửa
                        </Link>
                        <button
                          className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                          onClick={() => handleDelete(product.id)}
                        >
                          <MdDelete className="inline" /> Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-4 text-center bg-gray-100 text-gray-500 rounded-md"
                  >
                    <p className="text-lg font-semibold">
                      Không có sản phẩm nào.
                    </p>
                    <p className="text-sm">
                      Hãy thêm sản phẩm mới để hiển thị danh sách.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
            {/* phân trang */}
            <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setSearchParams({ page: page - 1 })}
            disabled={page <= 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Trước
          </button>
          <span>
            {page} / {lastPage}
          </span>
          <button
            onClick={() => setSearchParams({ page: page + 1 })}
            disabled={page >= lastPage}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Sau
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductList;
