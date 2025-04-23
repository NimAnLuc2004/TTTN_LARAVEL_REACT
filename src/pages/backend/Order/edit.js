import React, { useState, useEffect } from "react";
import OrderService from "../../../services/Orderservice";
import { Link, useParams } from "react-router-dom";
import ProductDetailService from "../../../services/ProductDetailservice ";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const OrderEdit = () => {
  const { id } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [productdetails, setProductdetails] = useState([]);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const result = await OrderService.show1(id);
        if (result.order_items) {
          setOrderItems(result.order_items);
          console.log(result);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm trong đơn hàng:", error);
        toast.error("Có lỗi khi tải sản phẩm trong đơn hàng!");
      }
    };
    fetchOrderItems();
  }, [id]);
  useEffect(() => {
    const fetchProductdetails = async () => {
      try {
        const response = await ProductDetailService.index();
        setProductdetails(response.prodetail || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
        toast.error("Có lỗi khi tải sản phẩm!");
      }
    };
    fetchProductdetails();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setOrderItems(updatedItems);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response=await OrderService.update({ order_items: orderItems }, id);
      if (response.status) {
      toast.success("Cập nhật sản phẩm trong đơn hàng thành công!");
      }
      else{
        toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm trong đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link
            to="/admin/order"
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Quay lại
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Chỉnh sửa sản phẩm trong đơn hàng
        </h2>

        <form onSubmit={handleSubmit}>
          {orderItems.map((item, index) => (
            <div
              key={item.id}
              className="mb-4 p-4 border rounded-md bg-gray-50"
            >
              {/* Chọn sản phẩm */}
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Sản phẩm
              </label>
              <select
                value={item.productdetail_id}
                onChange={(e) =>
                  handleInputChange(index, "productdetail_id", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">-- Chọn sản phẩm --</option>
                {productdetails.map((productdetail) => (
                  <option key={productdetail.id} value={productdetail.id}>
                    {productdetail.name}
                  </option>
                ))}
              </select>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Số lượng
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleInputChange(index, "quantity", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Giá
              </label>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleInputChange(index, "price", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Cập nhật sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEdit;
