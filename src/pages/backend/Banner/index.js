import React, { useEffect, useState } from "react";
import BannerService from "../../../services/Bannerservice";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaToggleOff,
  FaToggleOn,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const urlImage = "http://127.0.0.1:8000/images/";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  

  const fetchBanners = async () => {
    try {
      const result = await BannerService.index({
        page: pagination.current_page,
      });
      setBanners(result.banners ?? []);
      setPagination((prev) => ({
        ...prev,
        ...result.pagination,
      }));
    } catch (error) {
      setError("Không thể tải danh sách banner. Vui lòng thử lại!");
      toast.error("Lỗi khi tải danh sách banner!");
    }
  };
  useEffect(() => {
    fetchBanners();
  }, [pagination.current_page]);
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
      const allIds = filteredBanners.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredBanners = banners.filter((item) => {
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
  const sortedBanners = [...filteredBanners].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các banner đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => BannerService.delete(id)));
        setBanners((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách banner thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      try {
        await BannerService.delete(id);
        setBanners(banners.filter((banner) => banner.id !== id));
        toast.success("Xóa banner thành công!");
      } catch (error) {
        toast.error("Lỗi khi xóa banner!");
        console.error("Lỗi khi xóa banner:", error);
      }
    }
  };

  const handleStatus = async (id) => {
    try {
      await BannerService.status(id);
      setBanners((prevBanners) =>
        prevBanners.map((banner) =>
          banner.id === id
            ? { ...banner, status: banner.status === 1 ? 0 : 1 }
            : banner
        )
      );
      toast.info("Cập nhật trạng thái banner thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái!");
      console.error("Lỗi khi cập nhật trạng thái banner:", error);
    }
  };

  return (
    <div>
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Banner</p>
      </div>
      {/* search vs delete */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên banner..."
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

      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách Banner</h2>
        <Link to={"/admin/banner/add"}>
          <button className="bg-green-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaPlus className="inline" /> Thêm
          </button>
        </Link>
        <Link to={"/admin/banner/trash"}>
          <button className="bg-red-500 px-3 text-white text-sm py-2 mx-1 rounded-md">
            <FaTrash className="inline" /> Thùng rác
          </button>
        </Link>

        {error ? (
          <div className="text-red-500 text-center font-semibold">{error}</div>
        ) : (
          <><table className="w-full table-auto">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="p-4 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredBanners.length > 0 &&
                        selectedIds.length === filteredBanners.length} />
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
                    Tên banner{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="p-4">Hình ảnh</th>
                  <th className="p-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sortedBanners.length > 0 ? (
                  sortedBanners.map((banner) => (
                    <tr key={banner.id} className="border-b">
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(banner.id)}
                          onChange={() => handleCheckboxChange(banner.id)} />
                      </td>
                      <td className="p-4">{banner.id}</td>
                      <td className="p-4">{banner.name}</td>
                      <td className="p-4">
                        {banner.image ? (
                          <img
                            src={urlImage + "banner/" + JSON.parse(banner.image)[0]}
                            alt={banner.name}
                            className="w-16 h-16 object-cover" />
                        ) : (
                          <span className="text-gray-500">Không có ảnh</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleStatus(banner.id)}
                          className={`py-1 px-2 mx-0.5 text-white rounded-md ${banner.status === 1 ? "bg-green-500" : "bg-red-500"}`}
                        >
                          {banner.status === 1 ? (
                            <>
                              <FaToggleOn className="inline" /> Đang hoạt động
                            </>
                          ) : (
                            <>
                              <FaToggleOff className="inline" /> Không hoạt động
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <Link
                          to={`/admin/banner/show/${banner.id}`}
                          className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <IoEyeSharp className="inline" /> Xem
                        </Link>
                        <Link
                          to={`/admin/banner/edit/${banner.id}`}
                          className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <FaEdit className="inline" /> Chỉnh sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <MdDelete className="inline" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-4 text-center bg-gray-100 text-gray-500 rounded-md"
                    >
                      <p className="text-lg font-semibold">
                        Không có banner nào.
                      </p>
                      <p className="text-sm">
                        Hãy thêm banner mới để hiển thị danh sách.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table><div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => setPagination((prev) => ({
                    ...prev,
                    current_page: Math.max(prev.current_page - 1, 1),
                  }))}
                  disabled={pagination.current_page === 1}
                  className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                >
                  Trang trước
                </button>
                <span className="px-2 py-1">
                  Trang {pagination.current_page} / {pagination.last_page}
                </span>
                <button
                  onClick={() => setPagination((prev) => ({
                    ...prev,
                    current_page: Math.min(prev.current_page + 1, prev.last_page),
                  }))}
                  disabled={pagination.current_page === pagination.last_page}
                  className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                >
                  Trang sau
                </button>
              </div></>
        
        )}
      </section>
    </div>
  );
};

export default BannerList;
