import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const response = await fetch(
        "http://127.0.0.1:8000/api/frontend/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            content: formData.message,
            title: formData.title, // Sửa từ name thành title
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể gửi thông tin liên hệ.");
      }

      if (data.status) {
        setSuccess(
          "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể."
        );
        setFormData({ name: "", email: "", phone: "", title: "", message: "" }); // Thêm title
      } else {
        throw new Error(data.message || "Không thể gửi thông tin liên hệ.");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const infoVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Liên Hệ</h1>

        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            className="mb-4 p-3 bg-green-100 text-green-700 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {success}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-semibold mb-3 text-orange-500">
              Gửi Thông Tin
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Họ tên
                </label>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập họ tên"
                  required
                  aria-label="Họ tên"
                  whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email
                </label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập email của bạn"
                  required
                  aria-label="Email"
                  whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Số điện thoại
                </label>
                <motion.input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập số điện thoại"
                  required
                  aria-label="Số điện thoại"
                  whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Tiêu đề
                </label>
                <motion.input
                  type="text"
                  name="title" // Sửa từ titile thành title
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập tiêu đề"
                  required
                  aria-label="Tiêu đề"
                  whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Nội dung
                </label>
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập nội dung"
                  rows="4"
                  required
                  aria-label="Nội dung"
                  whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
                />
              </div>

              <motion.button
                type="submit"
                className={`w-full p-3 rounded-md transition ${
                  loading
                    ? "bg-orange-300 cursor-not-allowed opacity-70"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-white`}
                variants={buttonVariants}
                whileHover={!loading ? "hover" : ""}
                whileTap={!loading ? "tap" : ""}
                disabled={loading}
                aria-label={loading ? "Đang gửi thông tin" : "Gửi"}
              >
                {loading ? "Đang gửi thông tin..." : "Gửi"}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            variants={infoVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-semibold mb-3 text-orange-500">
              Thông Tin Liên Hệ
            </h2>
            <div className="space-y-3 text-gray-700 mb-5">
              <p>
                <strong>Hotline:</strong> 1900 1234 (8:00 - 21:00, tất cả các
                ngày trong tuần)
              </p>
              <p>
                <strong>Email:</strong> support@shop.com
              </p>
              <p>
                <strong>Địa chỉ:</strong> 123 Đường Shopee, Quận 1, TP.HCM
              </p>
              <p>
                <strong>Mạng xã hội:</strong> Theo dõi chúng tôi trên Facebook,
                Instagram và TikTok
              </p>
            </div>

            <h2 className="text-xl font-semibold mb-3 text-orange-500">
              Vị Trí
            </h2>
            <div className="w-full h-64 rounded-md overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.443684346756!2d106.7750474!3d10.8307098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752701a34a5d5f%3A0x30056b2fdf668565!2sCao+%C4%90%E1%BA%B3ng+C%C3%B4ng+Th%C6%B0%C6%A1ng+TP.HCM!5e0!3m2!1svi!2s!4v1698765432109!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ Cao Đẳng Công Thương TP.HCM"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
