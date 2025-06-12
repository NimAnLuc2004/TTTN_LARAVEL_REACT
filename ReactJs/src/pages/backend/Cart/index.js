import React, { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";

import { MdDelete } from "react-icons/md";
import CartService from "../../../services/Cartservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const CartList = () => {
  const [carts, setCarts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // Fetch carts from API
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await CartService.index(page);
        setCarts(response.cart.data ?? []);
        setLastPage(response.cart.last_page);
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    };

    fetchCarts();
  }, [page]);
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cart này?")) {
      try {
        await CartService.destroy(id); // Gọi API để xóa cart
        setCarts(carts.filter((cart) => cart.id !== id)); // Cập nhật state để loại bỏ cart đã xóa
        toast.success("Xóa giỏ hàng thành công!");
      } catch (error) {
        console.error("Error deleting cart:", error);
        toast.error("Lỗi khi xóa giỏ hàng!");
      }
    }
  };
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
      const allIds = filteredCarts.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredCarts = carts.filter((item) => {
    const name = item.product_name ? item.product_name.toString() : "";
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
  const sortedCarts = [...filteredCarts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aRaw = a[sortConfig.key] ?? "";
    const bRaw = b[sortConfig.key] ?? "";

    // Kiểm tra xem giá trị có thể chuyển thành số hợp lệ không
    const aIsNumber = !isNaN(Number(aRaw)) && aRaw !== "";
    const bIsNumber = !isNaN(Number(bRaw)) && bRaw !== "";

    // Nếu cả hai giá trị đều là số hợp lệ, so sánh như số
    if (aIsNumber && bIsNumber) {
      const aValue = Number(aRaw);
      const bValue = Number(bRaw);
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Nếu không, so sánh như chuỗi
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các giỏ hàng đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => CartService.destroy(id)));
        setCarts((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách giỏ hàng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Giỏ hàng</p>
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
        <h2 className="text-lg font-semibold mb-4">Danh sách Giỏ hàng</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredCarts.length > 0 &&
                    selectedIds.length === filteredCarts.length
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
                onClick={() => handleSort("product_id")}
              >
                Id sản phẩm{" "}
                {sortConfig.key === "product_id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("product_name")}
              >
                Tên sản phẩm{" "}
                {sortConfig.key === "product_name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("user_id")}
              >
                Id Người dùng
                {sortConfig.key === "user_id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("quantity")}
              >
                Số lượng
                {sortConfig.key === "quantity" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedCarts.length > 0 ? (
              sortedCarts.map((cart) => {
                return (
                  <tr key={cart.id} className="border-b">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(cart.id)}
                        onChange={() => handleCheckboxChange(cart.id)}
                      />
                    </td>
                    <td className="p-4">{cart.id}</td>
                    <td className="p-4">{cart.product_id}</td>
                    <td className="p-4">{cart.product_name}</td>
                    <td className="p-4">{cart.user_id}</td>
                    <td className="p-4">{cart.quantity}</td>
                    <td className="p-4">
                      <Link
                        to={`/admin/cart/show/${cart.id}`}
                        className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem
                      </Link>
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleDelete(cart.id)}
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
                    Không có giỏ hàng nào.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default CartList;
