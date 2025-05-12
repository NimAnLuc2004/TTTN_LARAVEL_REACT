import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserService from '../../../services/Userservice';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load email từ API khi component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await UserService.getUserProfile();
        if (response.status) {
          setFormData((prev) => ({
            ...prev,
            email: response.user.email,
          }));
          setLoading(false);
        } else {
          toast.error(response.message);
          setLoading(false);
        }
      } catch (err) {
        toast.error(err.message || 'Không thể tải thông tin người dùng');
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    setError(null);
    try {
      const response = await UserService.updateAccount({
        email: formData.email,
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      });
      if (response.status) {
        toast.success('Cập nhật tài khoản thành công!');
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra, vui lòng thử lại';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await UserService.logout();
      if (response.status) {
        localStorage.removeItem('token');
        toast.success('Đăng xuất thành công!');
        navigate('/login');
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  // Animation cho form
  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
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
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Tài khoản của tôi</h1>

        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
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

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <motion.input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Nhập email của bạn"
                required
                whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
              />
            </div>

            {/* Mật khẩu hiện tại */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">Mật khẩu hiện tại</label>
              <motion.input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Nhập mật khẩu hiện tại"
                required
                whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
              />
            </div>

            {/* Mật khẩu mới */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">Mật khẩu mới</label>
              <motion.input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Nhập mật khẩu mới"
                required
                whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
              />
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">Xác nhận mật khẩu mới</label>
              <motion.input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Xác nhận mật khẩu mới"
                required
                whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
              />
            </div>

            {/* Nút Cập nhật */}
            <motion.button
              type="submit"
              className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Cập nhật tài khoản
            </motion.button>
          </form>

          {/* Nút Đăng xuất */}
          <motion.button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition mt-5"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Đăng xuất
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountSettings;