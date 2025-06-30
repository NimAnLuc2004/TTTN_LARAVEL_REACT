import React, { useEffect, useState } from "react";
import BrandService from "../../../services/Brandservice";
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

const urlImage = "http://127.0.0.1:8000/images/";
const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  //phân trang
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await BrandService.index(page); // Gọi API truyền page
        if (result && result.brands && result.brands.data.length > 0) {
          setBrands(result.brands.data ?? []);
          setLastPage(result.brands.last_page);
        } else {
          setBrands([]);
        }
      } catch (error) {
        setError("Không thể tải danh sách thương hiệu. Vui lòng thử lại!");
        console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
        setBrands([]);
      }
    };

    fetchData();
  }, [page]);

  // Hàm xóa thương hiệu
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      try {
        await BrandService.delete(id); // Gọi API xóa thương hiệu
        setBrands(brands.filter((brand) => brand.id !== id)); // Loại bỏ thương hiệu đã xóa khỏi state
        toast.success("Xóa thương hiệu thành công!");
      } catch (error) {
        console.error("Error deleting brand:", error);
        toast.error("Lỗi khi xóa thương hiệu!");
      }
    }
  };

  // Hàm thay đổi trạng thái hoạt động
  const handleStatus = async (id) => {
    try {
      await BrandService.status(id);
      setBrands((prevBrands) =>
        prevBrands.map((brand) =>
          brand.id === id
            ? { ...brand, status: brand.status === 1 ? 0 : 1 }
            : brand
        )
      );
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating brand status:", error);
      toast.error("Lỗi khi cập nhật trạng thái!");
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
      const allIds = filteredBrands.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredBrands = brands.filter((item) => {
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
  const sortedBrands = [...filteredBrands].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các brand đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => BrandService.delete(id)));
        setBrands((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách brand thành công!");
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
        <p className="text-sm text-gray-500">Home / Quản lý Thương hiệu</p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên thương hiệu..."
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
        <h2 className="text-lg font-semibold mb-4">Danh sách Thương hiệu</h2>
        <Link to={"/admin/brand/add"}>
          <button className="bg-green-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaPlus className="inline" /> Thêm
          </button>
        </Link>
        <Link to={"/admin/brand/trash"}>
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
                      filteredBrands.length > 0 &&
                      selectedIds.length === filteredBrands.length
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
                  Tên thương hiệu{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4">Hình ảnh</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedBrands.length > 0 ? (
                sortedBrands.map((brand, index) => {
                  const jsxStatus =
                    brand.status === 1 ? (
                      <button
                        className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleStatus(brand.id)}
                      >
                        <FaToggleOn className="inline" /> Đang hoạt động
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        onClick={() => handleStatus(brand.id)}
                      >
                        <FaToggleOff className="inline" /> Không hoạt động
                      </button>
                    );

                  return (
                    <tr key={brand.id} className="border-b">
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(brand.id)}
                          onChange={() => handleCheckboxChange(brand.id)}
                        />
                      </td>
                      <td className="p-4">{brand.id}</td>
                      <td className="p-4">{brand.name}</td>
                      <td className="p-4">
                        {brand.image ? (
                          <img
                            src={
                              urlImage + "brand/" + JSON.parse(brand.image)[0]
                            }
                            alt={brand.name}
                            className="w-16 h-16 object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">Không có ảnh</span>
                        )}
                      </td>
                      <td className="p-4">{jsxStatus}</td>
                      <td className="p-4">
                        <Link
                          to={`/admin/brand/show/${brand.id}`}
                          className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <IoEyeSharp className="inline" /> Xem
                        </Link>
                        <Link
                          to={`/admin/brand/edit/${brand.id}`}
                          className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <FaEdit className="inline" /> Chỉnh sửa
                        </Link>
                        <button
                          className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                          onClick={() => handleDelete(brand.id)}
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
                      Không có thương hiệu nào.
                    </p>
                    <p className="text-sm">
                      Hãy thêm thương hiệu mới để hiển thị danh sách.
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

export default BrandList;
