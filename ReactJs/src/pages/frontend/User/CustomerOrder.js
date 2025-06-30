import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import OrderService from "../../../services/Orderservice";
import UserService from "../../../services/Userservice";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaTruck } from 'react-icons/fa';

const CustomerOrder = () => {
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chuẩn hóa trạng thái sang tiếng Việt
  const normalizeStatus = (status) => {
    if (!status) return "Đang xử lý";
    const statusMap = {
      pending: "Đang xử lý",
      shipping: "Đang giao",
      completed: "Đã giao",
      cancelled: "Đã hủy",
    };
    return statusMap[status.toLowerCase()] || "Đang xử lý";
  };

  // Tải danh sách đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderService.orderhistory();

        if (response.status) {
          const normalizedOrders = (response.data || [])
            .filter((order) => order && order.id)
            .map((order) => ({
              ...order,
              status: normalizeStatus(order.status),
            }));
          setOrders(normalizedOrders);
          setLoading(false);
        } else {
          setError(response.message || "Không thể tải đơn hàng");
          toast.error(response.message || "Không thể tải đơn hàng");
          setLoading(false);
        }
      } catch (err) {
        setError(err.message || "Không thể tải đơn hàng");
        toast.error(err.message || "Không thể tải đơn hàng");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Xác nhận hủy đơn hàng",
      text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, hủy đơn hàng",
      cancelButtonText: "Không",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await UserService.cancelOrder(orderId);

      console.log(response)
      if (response.status) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: "Đã hủy" } : order
          )
        );
        setExpandedOrder(null);
        toast.success("Hủy đơn hàng thành công!");
      } else {
        toast.error(response.message || "Không thể hủy đơn hàng");
      }
    } catch (err) {
      toast.error(err.message || "Không thể hủy đơn hàng");
    }
  };

  // Lọc đơn hàng theo trạng thái
  const statuses = ["Tất cả", "Đang xử lý", "Đang giao", "Đã giao", "Đã hủy"];
  const filteredOrders =
    selectedStatus === "Tất cả"
      ? orders
      : orders.filter((order) => order?.status === selectedStatus);

  // Animation cho danh sách đơn hàng
  const orderVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
  };

  // Animation cho chi tiết đơn hàng
  const detailVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.3 } },
  };

  // Animation cho nút
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  // Animation cho lỗi
  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-gray-700 text-base sm:text-xl animate-pulse">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm">
        <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-orange-500">
          Đơn hàng của tôi
        </h1>
        <Link
          to="/track-order"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-base sm:text-lg transition-colors duration-300 mb-4 sm:mb-6"
          title="Kiểm tra trạng thái đơn hàng của bạn"
        >
          <FaTruck className="text-lg sm:text-xl" />
          Theo dõi đơn hàng
        </Link>
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <motion.div
            className="text-red-500 mb-4 text-center text-sm sm:text-base"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
          >
            {error}
          </motion.div>
        )}

        {/* Lọc trạng thái */}
        <div className="mb-4 sm:mb-5">
          <h2 className="text-base sm:text-xl font-semibold mb-3 text-orange-500">
            Lọc theo trạng thái
          </h2>
          <div className="flex gap-2 sm:gap-3 flex-wrap overflow-x-auto">
            {statuses.map((status) => (
              <motion.button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md border transition text-sm sm:text-base whitespace-nowrap ${
                  selectedStatus === status
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Danh sách đơn hàng với thanh kéo */}
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base">
            Bạn chưa có đơn hàng nào trong trạng thái này!
          </p>
        ) : (
          <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto space-y-4 sm:space-y-5 pr-2">
            {filteredOrders.map((order, index) =>
              order ? (
                <motion.div
                  key={order.id}
                  custom={index}
                  variants={orderVariants}
                  initial="hidden"
                  animate="visible"
                  className="border border-gray-200 p-4 sm:p-5 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                    <div>
                      <p className="font-medium text-sm sm:text-base">Mã đơn hàng: {order.id}</p>
                      <p
                        className={`text-sm ${
                          order.status === "Đã giao"
                            ? "text-green-500"
                            : order.status === "Đang xử lý"
                            ? "text-orange-500"
                            : order.status === "Đang giao"
                            ? "text-blue-500"
                            : "text-red-500"
                        }`}
                      >
                        Trạng thái: {order.status}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-0">
                      Ngày đặt: {order.date || "N/A"}
                    </p>
                  </div>
                  <p className="text-right font-semibold text-orange-500 text-sm sm:text-base mb-3">
                    Tổng cộng: {(order.total || 0).toLocaleString()} ₫
                  </p>

                  {/* Chi tiết đơn hàng */}
                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        variants={detailVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-200 pt-3 mb-3">
                          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
                            Chi tiết sản phẩm
                          </h3>
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex gap-3 mb-3">
                              <img
                                src={item.image || "/placeholder-image.png"}
                                alt={item.name || "Sản phẩm"}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm sm:text-base">
                                  {item.name || "Sản phẩm không tên"}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  Số lượng: {item.quantity || 0}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  Giá: {((item.price || 0) * (item.quantity || 1)).toLocaleString()} ₫
                                </p>
                              </div>
                            </div>
                          ))}
                          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
                            Thông tin giao hàng
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Địa chỉ: {order.shippingAddress || "N/A"}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Số điện thoại: {order.shippingphone || "N/A"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Nút hành động */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <motion.button
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id
                        )
                      }
                      className="w-full sm:w-auto bg-orange-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-orange-600 transition text-sm sm:text-base"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {expandedOrder === order.id
                        ? "Ẩn chi tiết"
                        : "Xem chi tiết"}
                    </motion.button>
                    {order.status === "Đang xử lý" && (
                      <motion.button
                        onClick={() => handleCancelOrder(order.id)}
                        className="w-full sm:w-auto bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-red-600 transition text-sm sm:text-base"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Hủy đơn hàng
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrder;