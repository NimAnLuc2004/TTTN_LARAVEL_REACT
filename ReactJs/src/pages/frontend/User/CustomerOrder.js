import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import UserService from '../../../services/Userservice';

const CustomerOrder = () => {
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chuẩn hóa trạng thái sang tiếng Việt
  const normalizeStatus = (status) => {
    if (!status) return 'Đang xử lý'; // Xử lý status null hoặc undefined
    const statusMap = {
      processing: 'Đang xử lý',
      pending: 'Đang xử lý',
      shipping: 'Đang giao',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      completed: 'Đã giao',
      cancelled: 'Đã hủy',
      canceled: 'Đã hủy',
    };
    return statusMap[status.toLowerCase()] || 'Đang xử lý'; // Mặc định là 'Đang xử lý'
  };

  // Tải danh sách đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await UserService.getOrders();

        if (response.status) {
          // Lọc và chuẩn hóa dữ liệu
          const normalizedOrders = (response.data || [])
            .filter((order) => order && order.id) // Loại bỏ undefined/null hoặc order không có id
            .map((order) => ({
              ...order,
              status: normalizeStatus(order.status),
            }));
          setOrders(normalizedOrders);
          setLoading(false);
        } else {
          setError(response.message || 'Không thể tải đơn hàng');
          toast.error(response.message || 'Không thể tải đơn hàng');
          setLoading(false);
        }
      } catch (err) {
        setError(err.message || 'Không thể tải đơn hàng');
        toast.error(err.message || 'Không thể tải đơn hàng');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await UserService.cancelOrder(orderId);
    
      if (response.status) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: 'Đã hủy' } : order
          )
        );
        setExpandedOrder(null);
        toast.success('Hủy đơn hàng thành công!');
      } else {
        toast.error(response.message || 'Không thể hủy đơn hàng');
      }
    } catch (err) {
      toast.error(err.message || 'Không thể hủy đơn hàng');
    }
  };

  // Lọc đơn hàng theo trạng thái
  const statuses = ['Tất cả', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'];
  const filteredOrders =
    selectedStatus === 'Tất cả'
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
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
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
      <div className="container mx-auto p-5 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-gray-700 text-xl animate-pulse">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Đơn hàng của tôi</h1>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <motion.div
            className="text-red-500 mb-4 text-center"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
          >
            {error}
          </motion.div>
        )}

        {/* Lọc trạng thái */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">Lọc theo trạng thái</h2>
          <div className="flex gap-3 flex-wrap">
            {statuses.map((status) => (
              <motion.button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-md border transition ${
                  selectedStatus === status
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Danh sách đơn hàng */}
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có đơn hàng nào trong trạng thái này!</p>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order, index) =>
              order ? (
                <motion.div
                  key={order.id}
                  custom={index}
                  variants={orderVariants}
                  initial="hidden"
                  animate="visible"
                  className="border border-gray-200 p-5 rounded-lg hover:shadow-md transition"
                >
                  <div className="mb-3">
                    <p className="font-medium">Mã đơn hàng: {order.id}</p>
                    <p
                      className={`text-sm ${
                        order.status === 'Đã giao' ? 'text-green-500' :
                        order.status === 'Đang xử lý' ? 'text-orange-500' :
                        order.status === 'Đang giao' ? 'text-blue-500' :
                        'text-red-500'
                      }`}
                    >
                      Trạng thái: {order.status}
                    </p>
                  </div>
                  <p className="text-gray-600 mb-2">Ngày đặt: {order.date || 'N/A'}</p>
                  <p className="text-right font-semibold text-orange-500 mb-3">
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
                          <h3 className="text-lg font-semibold mb-2 text-gray-800">Chi tiết sản phẩm</h3>
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex gap-3 mb-3">
                              <img
                                src={item.image || ''}
                                alt={item.name || 'Sản phẩm'}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.name || 'Sản phẩm không tên'}</p>
                                <p className="text-gray-600">Số lượng: {item.quantity || 0}</p>
                                <p className="text-gray-600">Giá: {((item.price || 0) * (item.quantity || 1)).toLocaleString()} ₫</p>
                              </div>
                            </div>
                          ))}
                          <h3 className="text-lg font-semibold mb-2 text-gray-800">Thông tin giao hàng</h3>
                          <p className="text-gray-600">Địa chỉ: {order.shippingAddress || 'N/A'}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Nút hành động */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {expandedOrder === order.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                    </motion.button>
                    {order.status === 'Đang xử lý' && (
                      <motion.button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
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