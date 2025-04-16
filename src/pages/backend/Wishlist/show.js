import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import WishlistService from "../../../services/Wishlistservice";

const ShowWishlist = () => {
  const { id } = useParams();
  const [wishlist, setWishlist] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const result = await WishlistService.show(id);
        setWishlist(result.wishlist);
        console.log(result);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
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
  if (!wishlist) return <div>Đang tải...</div>; // Hiển thị khi chưa có dữ liệu

  // Nếu wishlist.image là chuỗi JSON thì parse nó thành mảng
  const images = wishlist.image ? JSON.parse(wishlist.image) : [];

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết Wishlist</h2>
      <div className="mb-4">
        <strong>Tên sản phẩm:</strong> {wishlist.product.name}
      </div>
      <div className="mb-4">
        <strong>Id User:</strong> {wishlist.user_id}
      </div>

      <div className="mb-4">
        <strong>Ngày tạo:</strong> {formatDate(wishlist.created_at)}
      </div>
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {formatDate(wishlist.updated_at)}
      </div>
      <div className="mb-4">
        <strong>Người tạo:</strong> {wishlist.created_by}
      </div>
      <div className="mb-4">
        <strong>Người cập nhật:</strong> {wishlist.updated_by}
      </div>
      <Link
        to="/admin/wishlist"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowWishlist;
