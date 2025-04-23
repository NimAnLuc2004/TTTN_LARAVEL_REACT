import React, { useState, useEffect } from "react";
import ProductDetailservice from "../../../services/ProductDetailservice ";
import ProductStoreservice from "../../../services/ProductStoreservice";
import { IoEyeSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const ProductStoreAdd = () => {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState(null);
  const [productList, setProductList] = useState([]);
  const [showProductList, setShowProductList] = useState(false);
  const [price_root, setPriceroot] = useState("");
  const [qty, setDataBegin] = useState(1);
  const [productstore, setStore] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [lastPage, setLastPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const fetchAllProducts = async () => {
    try {
      const result = await ProductDetailservice.index();
      const result1 = await ProductStoreservice.index(page);

      setStore(result1?.productstore.data || []);
      setProductList(result?.prodetail || []);


      setLastPage(result1.productstore.last_page);
      if (result1.productstore.data.length === 0) {
        toast.info("Hiện tại không có sản phẩm nào trong kho.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchAllProducts();
  }, [page,]);
  
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
      const allIds = filteredProductstores.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredProductstores = productstore.filter((item) => {
    const name = item.product_id ? item.product_id.toString() : "";
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
  const sortedProductstores = [...filteredProductstores].sort((a, b) => {
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

    if (window.confirm("Bạn có chắc chắn muốn xóa các nhập hàng đã chọn?")) {
      try {
        await Promise.all(selectedIds.map((id) => ProductStoreservice.delete(id)));
        setStore((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

        setSelectedIds([]);
        toast.success("Xóa nhiều danh sách nhập hàng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhiều:", error);
        toast.error("Đã xảy ra lỗi khi xóa!");
      }
    }
  };
  const handleProductSelect = (id, name) => {
    setProductId(id);
    setProductName(name);
    setShowProductList(false);
  };

  const handleSearchClick = () => {
    setShowProductList(true);
  };
  const handleAddSale = async (e) => {
    e.preventDefault();

    // Lấy giá trị từ các input
    const pricerootValue = document.getElementById("priceroot").value;
    const qtyValue = document.getElementById("qty").value;
    const productstore = {
      product_id: productId,
      qty: qtyValue,
      price_root: pricerootValue,
    };
    try {
      const result = await ProductStoreservice.insert(productstore);
      if (result.status) {
        //reset from
        toast.success("Nhập hàng thành công!");
        setProductName("");
        setPriceroot("");
        setDataBegin("");
        fetchAllProducts();
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error adding sale:", error);
      toast.error("Lỗi kết nối với máy chủ.");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhập kho này?")) {
      try {
        await ProductStoreservice.delete(id);
        setStore(productstore.filter((productstore) => productstore.id !== id));
      } catch (error) {
        console.error("Error deleting productstore:", error);
      }
    }
  };
  return (
    <><div className="bg-white shadow rounded-md p-4 mb-6">
      <p className="text-sm text-gray-500">Home / Quản lý nhập hàng</p>
    </div>
      <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Tìm theo id sản phẩm..."
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
    <div className=" flex flex-row bg-gray-100">
        <div className="basis-4/12 bg-white shadow-md rounded-md p-8">
          <div className="py-3">
            <Link
              to="/admin/product"
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Quay lại
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-6 text-center">Nhập Sản Phẩm</h1>
          <form className="grid grid-cols-2 gap-6 relative">
            {/* Tên Sản Phẩm */}
            <div className="relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productName"
              >
                Tên Sản Phẩm
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="productName"
                type="text"
                placeholder="Nhập tên sản phẩm"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required />
              <button
                type="button"
                onClick={handleSearchClick}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
              >
                Tìm sản phẩm
              </button>
              {/* Danh sách sản phẩm gợi ý */}
              {showProductList && productList.length > 0 && (
                <ul className="bg-white border border-gray-300 mt-2 rounded-md shadow-lg max-h-40 overflow-y-auto absolute z-10 w-full">
                  {productList.map((product) => (
                    <li
                      key={product.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProductSelect(product.id, product.name)}
                    >
                      {product.name} / ID: {product.id}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Giá Nhập */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="priceroot"
              >
                Giá Nhập
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="priceroot"
                type="number"
                step="1"
                placeholder="Nhập giá nhập"
                value={price_root}
                onChange={(e) => setPriceroot(e.target.value)}
                required />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="qty"
              >
                Số lượng
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="qty"
                type="number"
                step="1"
                value={qty}
                onChange={(e) => setDataBegin(e.target.value)}
                required />
            </div>

            {/* Nút Submit */}
            <div className="col-span-2 flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleAddSale}
              >
                Nhập hàng
              </button>
            </div>
          </form>
        </div>
        <div className="basis-8/12 px-8 ">
          <table className="w-full bg-white shadow-md rounded-md  table-auto">

            <thead>
              <Link
                to="/admin/productstore/trash"
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Thùng rác
              </Link>
              <tr className="text-left text-gray-600 border-b">
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredProductstores.length > 0 &&
                    selectedIds.length === filteredProductstores.length
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
                  Id Sản phẩm{" "}
                  {sortConfig.key === "product_id" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("qty")}
                >
                 Số lượng{" "}
                  {sortConfig.key === "qty" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedProductstores.length > 0 ? (
                sortedProductstores.map((store) => {

                  return (
                    <tr key={store.id} className="border-b">
                      <td className="p-4 text-center"><input
                        type="checkbox"
                        checked={selectedIds.includes(store.id)}
                        onChange={() => handleCheckboxChange(store.id)}
                      /></td>
                      <td className="p-4">{store.id}</td>
                      <td className="p-4">{store.product_id}</td>
                      <td className="p-4">{store.qty}</td>
                      <td className="p-4">
                        <Link to={`/admin/productstore/show/${store.id}`}>
                          <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                            <IoEyeSharp className="inline" /> Xem
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
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
                    colSpan="4"
                    className="p-4 text-center text-red-500 font-bold"
                  >
                    Hiện tại không có sản phẩm nào trong kho.
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
      </div></>
  );
};

export default ProductStoreAdd;
