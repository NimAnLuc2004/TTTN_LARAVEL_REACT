import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationService from '../../../services/Notificationservice ';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await NotificationService.getNotifications();
        if (response.status) {
          setNotifications(response.notifications);
          setLoading(false);
        } else {
          setError(response.message);
          toast.error(response.message);
          setLoading(false);
        }
      } catch (err) {
        setError('Không thể tải danh sách thông báo');
        toast.error('Không thể tải danh sách thông báo');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Animation cho thông báo
  const notificationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
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
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Thông báo</h1>

        {notifications.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có thông báo nào!</p>
        ) : (
          <div className="space-y-5">
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                custom={index}
                variants={notificationVariants}
                initial="hidden"
                animate="visible"
                className="border border-gray-200 p-5 rounded-lg hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{notif.message}</h3>
                  <p className="text-gray-500 text-sm">{notif.date}</p>
                </div>
                <p className="text-gray-700">{notif.message}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;