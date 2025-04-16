import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import notFoundAnimation from '../assets/animation/404.json'; // Đảm bảo file này nằm trong src/assets/animation

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-pink-100">
      <motion.div
        className="backdrop-blur-md bg-white/40 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="w-64 mx-auto mb-6">
          <Lottie animationData={notFoundAnimation} loop={true} />
        </div>
        <h1 className="text-6xl font-extrabold text-indigo-700 drop-shadow-sm">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-2">Không tìm thấy trang</h2>
        <p className="mt-4 text-gray-600">
          Trang bạn đang tìm không tồn tại hoặc đã bị xóa. Hãy quay về trang chủ nhé.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block mt-6"
        >
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300"
          >
            Quay lại trang chính
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
