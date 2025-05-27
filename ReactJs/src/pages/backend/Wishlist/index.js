import React, { useEffect, useState } from "react";

import { MdDelete } from "react-icons/md";
import WishListService from "../../../services/Wishlistservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoEyeSharp } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";

const WishListList = () => {
  const [wishlists, setWishLists] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  //phân trang
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  // Fetch wishlists from API
  useEffect(() => {
    const fetchWishLists = async () => {
      try {
        const response = await WishListService.index(page);
        setWishLists(response.wishlist.data ??[]);
        setLastPage(response.wishlist.last_page);
      } catch (error) {
        console.error("Error fetching wishlists:", error);
      }
    };

    fetchWishLists();
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
      const allIds = filteredWishlists.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredWishlists = wishlists.filter((item) => {
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
  const sortedWishlists = [...filteredWishlists].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các wishlist đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => WishListService.destroy(id)));
        setWishLists((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );
        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách yêu thích thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };
  // Hàm bỏ dấu tiếng Việt

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa wishlist này?")) {
      try {
        await WishListService.destroy(id); // Gọi API để xóa wishlist
        setWishLists((prevWishLists) =>
          prevWishLists.filter((wishlist) => wishlist.id !== id)
        ); // Cập nhật state để loại bỏ wishlist đã xóa
        toast.success("Xóa danh sách yêu thích thành công!");
      } catch (error) {
        console.error("Error deleting wishlist:", error);
        toast.error("Lỗi khi xóa danh sách yêu thích!");
      }
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">
          Home / Quản lý Danh sách yêu thích
        </p>
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
        <h2 className="text-lg font-semibold mb-4">Danh sách yêu thích</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-4 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedIds.length === filteredWishlists.length &&
                      filteredWishlists.length > 0
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
                  onClick={() => handleSort("user_id")}
                >
                  ID người dùng{" "}
                  {sortConfig.key === "user_id" &&
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
                <th className="p-4">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {sortedWishlists.length > 0 ? (
                sortedWishlists.map((wishlist) => (
                  <tr key={wishlist.id} className=" border-b">
                    <td  className="p-4 text-center">
                      <input
                        className="p-4 text-center"
                        type="checkbox"
                        checked={selectedIds.includes(wishlist.id)}
                        onChange={() => handleCheckboxChange(wishlist.id)}
                      />
                    </td>
                    <td className="p-4">{wishlist.id}</td>
                    <td className="p-4">{wishlist.user_id}</td>
                    <td className="p-4">{wishlist.product_name}</td>
                    <td className="p-4">
                      <Link
                        to={`/admin/wishlist/show/${wishlist.id}`}
                        className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem
                      </Link>
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleDelete(wishlist.id)}
                      >
                        <MdDelete className="inline" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    Không có danh sách yêu thích nào.
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
        </div>
      </section>
    </div>
  );
};

export default WishListList;
