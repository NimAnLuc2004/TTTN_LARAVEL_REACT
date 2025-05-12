import React, { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import LogService from "../../../services/Logservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const LogList = () => {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const fetchLogs = async (page) => {
    try {
      const response = await LogService.index(page);
      setLogs(response.data ?? []);
      setMeta({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total,
      });
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };
  const filteredLogs = logs.filter((item) => {
    const name = item.action ? item.action.toString() : "";
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
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">Home / Quản lý Log</p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tác động ..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="border border-gray-300 px-3 py-2 rounded w-1/3"
        />
      </div>
      {/* Content */}
      <section className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách Log</h2>
        <table className="w-full table-auto mt-4">
          <thead>
            <tr className="text-left text-gray-600 border-b">
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
                onClick={() => handleSort("table_name")}
              >
                Bảng{" "}
                {sortConfig.key === "table_name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("action")}
              >
                Tác động{" "}
                {sortConfig.key === "action" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("user_id")}
              >
                Id người thực hiện{" "}
                {sortConfig.key === "user_id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.length > 0 ? (
              sortedLogs.map((log, index) => (
                <tr key={log.id} className="border-b">
                  <td className="p-4">{log.id}</td>
                  <td className="p-4">{log.table_name}</td>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4">{log.user_id}</td>
                  <td className="p-4">
                    <Link
                      to={`/admin/log/show/${log.id}`}
                      className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                    >
                      <IoEyeSharp className="inline" /> Xem
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="p-4 text-center bg-gray-100 text-gray-500 rounded-md"
                >
                  <p className="text-lg font-semibold">Không có log nào.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {meta && meta.current_page && (
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              className={`py-1 px-3 text-white rounded-md ${
                meta.current_page === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={meta.current_page === 1}
            >
              Trang trước
            </button>
            <span>
              Trang {meta.current_page} / {meta.last_page}
            </span>
            <button
              className={`py-1 px-3 text-white rounded-md ${
                meta.current_page === meta.last_page
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, meta.last_page))
              }
              disabled={meta.current_page === meta.last_page}
            >
              Trang sau
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default LogList;
