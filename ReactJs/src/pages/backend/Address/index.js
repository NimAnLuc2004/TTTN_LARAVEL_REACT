import React, { useCallback, useState, useEffect } from "react";
import AddressService from "../../../services/Addressservice";
import { IoEyeSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const AddressAdd = () => {
  const [addresses, setAddresses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // Dùng useCallback để nhớ hàm này, chỉ thay đổi khi 'page' thay đổi
  const fetchAllAddresses = useCallback(async () => {
    try {
      const result = await AddressService.index(page);
      const data = result?.ship?.data || [];
      setAddresses(data);
      setLastPage(result?.ship?.last_page || 1);
      if (data.length === 0) toast.info("Chưa có địa chỉ nào.");
    } catch (error) {
      console.error("Lỗi khi tải địa chỉ:", error);
      toast.error("Không thể tải danh sách địa chỉ.");
    }
  }, [page]); // Chỉ thay đổi khi `page` thay đổi

  useEffect(() => {
    fetchAllAddresses();
  }, [fetchAllAddresses]);

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
      const allIds = filteredAddresses.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      try {
        await AddressService.destroy(id);
        setAddresses((prev) => prev.filter((item) => item.id !== id));
        toast.success("Xóa địa chỉ thành công!");
      } catch (error) {
        toast.error("Lỗi khi xóa địa chỉ!");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info("Vui lòng chọn ít nhất một mục để xóa.");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa các địa chỉ đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => AddressService.destroy(id)));
        setAddresses((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );
        setSelectedIds([]);
        toast.success("Xóa nhiều địa chỉ thành công!");
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };

  const filteredAddresses = addresses.filter((item) =>
    removeVietnameseTones(item.phone?.toLowerCase() || "").includes(
      removeVietnameseTones(searchTerm.toLowerCase())
    )
  );

  const sortedAddresses = [...filteredAddresses].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (sortConfig.key === "id" || sortConfig.key === "user_id") {
      const aValue = Number(a[sortConfig.key] || 0);
      const bValue = Number(b[sortConfig.key] || 0);
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Tìm theo số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white px-4 py-2 rounded-md"
        >
          <MdDelete className="inline" /> Xóa đã chọn
        </button>
      </div>

      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách địa chỉ</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedIds.length === filteredAddresses.length &&
                    filteredAddresses.length > 0
                  }
                />
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("user_id")}
              >
                ID Người dùng{" "}
                {sortConfig.key === "user_id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("phone")}
              >
                Số điện thoại{" "}
                {sortConfig.key === "phone" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedAddresses.length > 0 ? (
              sortedAddresses.map((address) => (
                <tr key={address.id} className="border-b">
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(address.id)}
                      onChange={() => handleCheckboxChange(address.id)}
                    />
                  </td>
                  <td className="p-4">{address.id}</td>
                  <td className="p-4">{address.user_id}</td>
                  <td className="p-4">{address.phone || "Không có"}</td>
                  <td className="p-4">
                    <Link to={`/admin/address/show/${address.id}`}>
                      <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                        <IoEyeSharp className="inline" /> Xem
                      </button>
                    </Link>
                    <button
                      className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                      onClick={() => handleDelete(address.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Hiện tại không có địa chỉ nào.
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

export default AddressAdd;
