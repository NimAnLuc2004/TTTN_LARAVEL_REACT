import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserService from '../../../services/Userservice';

const Vouchers = () => {
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vouchers on mount
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const response = await UserService.getVouchers();
        if (response.status) {
          // Use status_label from backend directly
          const processedVouchers = response.discounts.map((voucher) => ({
            ...voucher,
            status: voucher.status_label, // Trust backend's status_label
          }));

          setVouchers(processedVouchers);
          setLoading(false);
        } else {
          setError(response.message);
          toast.error(response.message);
          setLoading(false);
        }
      } catch (err) {
        setError('Không thể tải danh sách voucher');
        toast.error('Không thể tải danh sách voucher');
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // Filter vouchers by status
  const statuses = ['Tất cả', 'Có hạn sử dụng', 'Đã sử dụng', 'Hết hạn'];
  const filteredVouchers = selectedStatus === 'Tất cả'
    ? vouchers
    : vouchers.filter((voucher) => voucher.status === selectedStatus);

  // Animation for vouchers
  const voucherVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
  };

  // Animation for buttons
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  // Map status to colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Có hạn sử dụng':
        return 'text-green-500';
      case 'Đã sử dụng':
        return 'text-gray-500';
      case 'Hết hạn':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-5 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-orange-500 text-xl animate-pulse">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Kho voucher</h1>

        {/* Filter by status */}
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

        {/* Voucher list */}
        {filteredVouchers.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có voucher nào trong trạng thái này!</p>
        ) : (
          <div className="space-y-5">
            {filteredVouchers.map((voucher, index) => (
              <motion.div
                key={voucher.id}
                custom={index}
                variants={voucherVariants}
                initial="hidden"
                animate="visible"
                className="border border-gray-200 p-5 rounded-lg hover:shadow-md transition"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Mã: {voucher.code}</h3>
                  <p className={`text-sm ${getStatusColor(voucher.status)}`}>
                    {voucher.status}
                  </p>
                </div>
                <p className="text-gray-700 mb-2">{voucher.description}</p>
                <p className="text-gray-600">Hạn sử dụng: {voucher.expiry_date || 'Không có hạn'}</p>
                {voucher.status === 'Có hạn sử dụng' && (
                  <motion.button
                    className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Sử dụng ngay
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vouchers;