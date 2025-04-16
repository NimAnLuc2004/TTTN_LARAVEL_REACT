import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CartService from "../../../services/Cartservice";

const ShowCart = () => {
  const { id } = useParams();
  const [cart, setCart] = useState(null);
  const [productname, setProductName] = useState(null);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const result = await CartService.show(id); 
        setCart(result.cart);
        setProductName(result.product_name); 
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart(); // Gọi hàm lấy dữ liệu khi component mount
  }, [id]);
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  if (!cart) return <div>Đang tải...</div>; // Hiển thị khi chưa có dữ liệu



  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết giỏ hàng</h2>
      <div className="mb-4">
        <strong>Tên sản phẩm:</strong> {productname}
      </div>
      <div className="mb-4">
        <strong>Id User:</strong> {cart.user_id}
      </div>
      <div className="mb-4">
        <strong>Số lượng:</strong> {cart.quantity}
      </div>
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(cart.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(cart.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {cart.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {cart.updated_by}
      </div>
      <Link
        to="/admin/cart"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowCart;
