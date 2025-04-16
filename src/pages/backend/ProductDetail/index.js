import React, { useEffect, useState } from "react";
import ProductDetailService from "../../../services/ProductDetailservice ";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoEyeSharp } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";


const ProductDetailList = () => {
  const [productdetails, setProductDetails] = useState([]);
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
        const result = await ProductDetailService.index(page);
        if (result && result.prodetail.data && result.prodetail.data.length > 0) {
          setProductDetails(result.prodetail.data??[]);
          setLastPage(result.prodetail.last_page);
        } else {
          setProductDetails([]);
          toast.info("Danh sách chi tiết sản phẩm trống!", { autoClose: 2000 });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu chi tiết sản phẩm:", error);
        setError("Không thể tải danh sách thành viên. Vui lòng thử lại!");
        setProductDetails([]);

        toast.error("Không thể tải danh sách chi tiết sản phẩm!", {
          autoClose: 2000,
        });
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
      const allIds = filteredProductdetails.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredProductdetails = productdetails.filter((item) => {
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
  const sortedProductdetails = [...filteredProductdetails].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các chi tiết sản phẩm đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => ProductDetailService.destroy(id)));
        setProductDetails((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách chi tiết sản phẩm thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chi tiết sản phẩm này?")) {
      try {
        await ProductDetailService.destroy(id);
        setProductDetails(
          productdetails.filter((productdetail) => productdetail.id !== id)
        );
        toast.success("Xóa chi tiết sản phẩm thành công!", { autoClose: 2000 });
      } catch (error) {
        console.error("Error deleting productdetail:", error);
        toast.error("Lỗi khi xóa chi tiết sản phẩm!", { autoClose: 2000 });
      }
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-sm text-gray-500">
          Home / Quản lý Chi tiết sản phẩm
        </p>
      </div>
   {/* search vs delete */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên chi tiết sản phẩm..."
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
          <Link to={"/admin/productdetail/add"}>
            <FaPlus className="inline" /> Thêm chi tiết sản phẩm
          </Link>
        </button>
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
                    filteredProductdetails.length > 0 &&
                    selectedIds.length === filteredProductdetails.length
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
                onClick={() => handleSort("product_name")}
              >
                Tên chi tiết sản phẩm{" "}
                {sortConfig.key === "product_name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("color")}
              >
                Màu{" "}
                {sortConfig.key === "color" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("size")}
              >
                Size{" "}
                {sortConfig.key === "size" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedProductdetails.length > 0 ? (
                sortedProductdetails.map((productdetail) => {
                  return (
                    <tr key={productdetail.id} className="border-b">
                      <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(productdetail.id)}
                        onChange={() => handleCheckboxChange(productdetail.id)}
                      />
                      </td>
                      <td className="p-4">{productdetail.id}</td>
                      <td className="p-4">{productdetail.product_name}</td>
                      <td className="p-4">{productdetail.color}</td>
                      <td className="p-4">{productdetail.size} </td>
                      <td className="p-4">
                        <Link
                          to={`/admin/productdetail/show/${productdetail.id}`}
                          className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <IoEyeSharp className="inline" /> Xem
                        </Link>
                        <Link
                          to={`/admin/productdetail/edit/${productdetail.id}`}
                          className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md"
                        >
                          <FaEdit className="inline" /> Chỉnh sửa
                        </Link>
                        <button
                          className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                          onClick={() => handleDelete(productdetail.id)}
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
                      Không có chi tiết sản phẩm nào.
                    </p>
                    <p className="text-sm">
                      Hãy thêm chi tiết sản phẩm mới để hiển thị danh sách.
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

export default ProductDetailList;
