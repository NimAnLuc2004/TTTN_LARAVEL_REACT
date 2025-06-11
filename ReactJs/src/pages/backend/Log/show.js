import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LogService from "../../../services/Logservice";
import { toast } from "react-toastify";

const LogDetail = () => {
  const { id } = useParams();
  const [log, setLog] = useState(null);

  useEffect(() => {
    fetchLogDetail();
  }, []);

  const fetchLogDetail = async () => {
    try {
      const response = await LogService.show(id);
      setLog(response);
    } catch (error) {
      toast.error("Lỗi khi tải log!");
    }
  };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  

  
  if (!log) {
    return <p className="text-center text-gray-500">Đang tải...</p>;
  }

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết Log</h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="border p-2 font-semibold">ID</td>
            <td className="border p-2">{log.id}</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">Action</td>
            <td className="border p-2">{log.action}</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">Mô tả</td>
            <td className="border p-2">{log.description}</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">Tên bảng</td>
            <td className="border p-2">{log.table_name}</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">ID bản ghi</td>
            <td className="border p-2">{log.record_id}</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">ID Người thực hiện</td>
            <td className="border p-2">{log.user_id}</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">Ngày tạo</td>
            <td className="border p-2">{formatDate(log.created_at)}</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">Người cập nhật</td>
            <td className="border p-2">{formatDate(log.update_at)}</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">Người tạo</td>
            <td className="border p-2">{log.created_by}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4">
        <Link to="/admin/log">
          <button className="bg-blue-500 text-white px-3 py-2 rounded-md">Quay lại</button>
        </Link>
      </div>
    </div>
  );
};

export default LogDetail;
