import React, { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import {
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DiscountService from "../../../services/Discountservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const DiscountList = () => {
  const [discounts, setDiscounts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
   //phân trang
    const [lastPage, setLastPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;
  // Fetch discounts from API
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await DiscountService.index(page);

        setDiscounts(response.discount.data ?? []);
        setLastPage(response.discount.last_page);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    fetchDiscounts();
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
      const allIds = filteredDiscounts.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredDiscounts = discounts.filter((item) => {
    const name = item.code ? item.code.toString() : "";
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
  const sortedDiscounts = [...filteredDiscounts].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các phiếu giảm giá đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => DiscountService.delete(id)));
        setDiscounts((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách phiếu giảm giá thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phiếu giảm giá này?")) {
      try {
        await DiscountService.delete(id); // Gọi API để xóa discount
        setDiscounts(discounts.filter((discount) => discount.id !== id)); // Cập nhật state để loại bỏ discount đã xóa
        toast.success("Xóa phiếu giảm giá thành công!");
      } catch (error) {
        console.error("Error deleting discount:", error);
        toast.error("Lỗi khi xóa phiếu giảm giá!");
      }
    }
  };
  const handleStatus = async (id) => {
    try {
      await DiscountService.status(id);
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount.id === id
            ? { ...discount, status: discount.status === 1 ? 0 : 1 }
            : discount
        )
      );
      toast.info("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("Lỗi khi cập nhật trạng thái!");
    }
  };
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Phiếu giảm giá</p>
      </div>
  <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo code..."
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
        <h2 className="text-lg font-semibold mb-4">Danh sách Phiếu giảm giá</h2>
        <Link to={"/admin/discount/add"}>
          <button className="bg-green-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaPlus className="inline" /> Thêm
          </button>
        </Link>
        <Link to={`/admin/discount/trash`}>
          <button className="bg-red-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaTrash className="inline" /> Thùng rác
          </button>
        </Link>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
            <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredDiscounts.length > 0 &&
                    selectedIds.length === filteredDiscounts.length
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
                onClick={() => handleSort("code")}
              >
                Code{" "}
                {sortConfig.key === "code" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("discount_percent")}
              >
                Phần trăm giảm giá{" "}
                {sortConfig.key === "discount_percent" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedDiscounts.length > 0 ? (
              sortedDiscounts.map((discount) => {
                const jsxStatus =
                  discount.status === 1 ? (
                    <button
                      className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      onClick={() => handleStatus(discount.id)}
                    >
                      <FaToggleOn className="inline" />
                     Phát Hành
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      onClick={() => handleStatus(discount.id)}
                    >
                      <FaToggleOff className="inline" />
                      Chưa Phát Hành
                    </button>
                  );

                return (
                  <tr key={discount.id} className="border-b">
                    <td className="p-4 text-center">
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(discount.id)}
                        onChange={() => handleCheckboxChange(discount.id)}
                      />
                    </td>
                    <td className="p-4">{discount.id}</td>
                    <td className="p-4">{discount.code}</td>
                    <td className="p-4">{discount.discount_percent}</td>

                    <td className="p-4">{jsxStatus}</td>
                    <td className="p-4">
                      <Link
                        to={`/admin/discount/show/${discount.id}`}
                        className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <IoEyeSharp className="inline" /> Xem
                      </Link>
                      <Link
                        to={`/admin/discount/edit/${discount.id}`}
                        className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      >
                        <FaEdit className="inline" /> Chỉnh sửa
                      </Link>
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleDelete(discount.id)}
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
                  Không có phiếu giảm giá nào.
                </p>
                <p className="text-sm">
                  Hãy thêm phiếu giảm giá mới để hiển thị danh sách.
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

export default DiscountList;
