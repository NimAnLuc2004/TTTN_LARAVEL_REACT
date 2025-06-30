import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import Orderservice from "../../../services/Orderservice";

const TrackOrder = () => {
  const [input, setInput] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setOrders([]);
    setIsLoading(true);

    try {
      // Gửi cả order_id và phone, backend sẽ ưu tiên order_id
      const response = await Orderservice.trackOrder({
        order_id: input,
        phone: input,
      });

      if (response.status) {
        setOrders(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } else {
        setError(response.message || "Đơn hàng không tồn tại");
      }
    } catch (err) {
      setError("Đơn hàng không tồn tại");
      console.error("Error tracking order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const statusStyles = {
    pending: {
      text: "Đang xử lý",
      icon: <FaClock className="text-yellow-500" />,
      bg: "bg-yellow-100",
    },
    shipped: {
      text: "Đang giao",
      icon: <FaTruck className="text-blue-500" />,
      bg: "bg-blue-100",
    },
    delivered: {
      text: "Đã giao",
      icon: <FaCheckCircle className="text-green-500" />,
      bg: "bg-green-100",
    },
    cancelled: {
      text: "Đã hủy",
      icon: <FaTimesCircle className="text-red-500" />,
      bg: "bg-red-100",
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6"
      >
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Theo dõi đơn hàng
        </h1>

        {/* Form nhập mã đơn hàng hoặc số điện thoại */}
        <form onSubmit={handleTrack} className="flex items-center mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập mã đơn hàng hoặc số điện thoại"
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 text-white p-3 rounded-r-lg hover:bg-orange-600 flex items-center justify-center disabled:bg-orange-300"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <FaSearch />
            )}
          </button>
        </form>

        {/* Thông báo lỗi */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-4"
          >
            {error}
          </motion.p>
        )}

        {/* Danh sách đơn hàng */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-h-[70vh] overflow-y-auto"
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.order_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b pb-4"
              >
                {/* Thông tin chung */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Đơn hàng #{order.order_id}
                  </h2>
                  <p className="text-gray-600">
                    Ngày đặt: {new Date(order.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    Tổng tiền: {order.total.toLocaleString()} ₫
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[order.tracking?.status || order.status]?.bg
                      }`}
                    >
                      {
                        statusStyles[order.tracking?.status || order.status]
                          ?.icon
                      }
                      <span className="ml-2">
                        {
                          statusStyles[order.tracking?.status || order.status]
                            ?.text
                        }
                      </span>
                    </span>
                  </div>
                </div>

                {/* Sản phẩm */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Sản phẩm
                  </h3>
                  {order.products.length === 0 ? (
                    <p className="text-gray-500 text-center italic">
                      Không có sản phẩm trong đơn hàng
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {order.products.map((product) => (
                        <motion.div
                          key={product.product_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-gray-600">
                              Số lượng: {product.quantity} | Giá:{" "}
                              {product.price.toLocaleString()} ₫
                            </p>
                          </div>
                          <p className="font-semibold text-orange-600">
                            {(
                              product.quantity * product.price
                            ).toLocaleString()}{" "}
                            ₫
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thông tin giao hàng */}
                {order.tracking && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <FaTruck className="mr-2 text-orange-600" />
                      Thông tin giao hàng
                    </h3>
                    <p className="text-gray-600">
                      Đơn vị vận chuyển:{" "}
                      {order.tracking.carrier || "Chưa xác định"}
                    </p>
                    <p className="text-gray-600">
                      Mã vận đơn: {order.tracking.tracking_number || "Chưa có"}
                    </p>
                    <p className="text-gray-600">
                      Trạng thái:{" "}
                      {statusStyles[order.tracking.status]?.text ||
                        order.tracking.status}
                    </p>
                    {order.tracking.last_updated && (
                      <p className="text-gray-600">
                        Cập nhật lần cuối:{" "}
                        {new Date(order.tracking.last_updated).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Địa chỉ giao hàng */}
                {order.shipping_address && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-orange-600" />
                      Địa chỉ giao hàng
                    </h3>
                    <p className="text-gray-600">
                      Địa chỉ: {order.shipping_address.address}
                    </p>
                    <p className="text-gray-600">
                      Số điện thoại: {order.shipping_address.phone}
                    </p>
                    {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? (
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
                          order.shipping_address.address
                        )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                        className="w-full h-64 rounded-lg mt-4"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 rounded-lg mt-4 flex items-center justify-center">
                        <p className="text-gray-500">
                          Map will be displayed here once API key is provided
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackOrder;
