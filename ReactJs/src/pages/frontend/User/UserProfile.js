import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../../services/Userservice";
import Notifications from "./Notifications";
import Vouchers from "./Vouchers";
import CustomerOrder from "./CustomerOrder";
import AccountSettings from "./AccountSettings";
import { useLocation } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "https://placehold.co/150x150?text=Avatar",
  });
  const [editForm, setEditForm] = useState({ ...userInfo });
  const [avatarPreview, setAvatarPreview] = useState(userInfo.avatar);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Handle navigation state to set active tab
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Load user profile from API
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await UserService.getUserProfile();
        if (response.status) {
          const user = response.user;

          const avatar =
            user.image && Array.isArray(user.image) && user.image.length > 0
              ? `http://127.0.0.1:8000/images/user/${user.image[0]}`
              : "https://placehold.co/150x150?text=Avatar";

          setUserInfo({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
            avatar,
          });
          setEditForm({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
            avatar,
          });
          setAvatarPreview(avatar);
          setLoading(false);
        } else {
          setError(response.message);
          toast.error(response.message);
          setLoading(false);
        }
      } catch (err) {
        setError("Không thể tải thông tin người dùng");
        toast.error("Không thể tải thông tin người dùng");
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleEditChange = (e) => {
    // Prevent email changes
    if (e.target.name === "email") return;
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    if (files.length > 0) {
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setAvatarPreview(userInfo.avatar);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    if (editForm.phone && !phoneRegex.test(editForm.phone)) {
      setError("Số điện thoại phải có 10 chữ số!");
      toast.error("Số điện thoại phải có 10 chữ số!");
      return;
    }
    setError(null);

    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("email", userInfo.email); // Always use the original email
    formData.append("phone", editForm.phone);
    formData.append("address", editForm.address);
    images.forEach((image) => formData.append("image[]", image));

    try {
      const response = await UserService.updateProfile(formData);

      if (response.status) {
        const user = response.user;
        const avatar =
          Array.isArray(user.image) && user.image.length > 0
            ? `http://127.0.0.1:8000/images/user/${user.image[0]}`
            : "https://via.placeholder.com/150?text=Avatar";
        const updatedUserInfo = {
          name: user.name,
          email: user.email, // Keep the original email
          phone: user.phone || "",
          address: user.address || "",
          avatar,
        };
        setUserInfo(updatedUserInfo);
        setEditForm(updatedUserInfo);
        setAvatarPreview(avatar);
        setImages([]);
        setIsEditing(false);
        toast.success("Cập nhật hồ sơ thành công!");
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ ...userInfo });
    setAvatarPreview(userInfo.avatar);
    setImages([]);
    setError(null);
    setIsEditing(false);
  };

  // Animation variants (unchanged)
  const avatarVariants = {
    initial: { opacity: 0, scale: 0.8, rotate: -10 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      boxShadow: "0 0 15px rgba(236, 72, 153, 0.5)",
      transition: { duration: 0.3 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const greetingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const tabButtonVariants = {
    initial: { opacity: 0, x: -20 },
    animate: (index) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
    hover: {
      scale: 1.1,
      color: "#EC4899",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
    active: {
      color: "#EC4899",
      borderBottom: "2px solid #EC4899",
      transition: { duration: 0.3 },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
    focus: {
      scale: 1.02,
      borderColor: "#EC4899",
      transition: { duration: 0.3 },
    },
    error: {
      x: [0, -5, 5, -5, 0],
      borderColor: "#EF4444",
      transition: { duration: 0.5 },
    },
  };

  const infoItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 15px rgba(236, 72, 153, 0.5)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <div className="relative flex items-center justify-center min-h-96 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-white text-xl animate-pulse">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-96 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-10">
      {/* Animated Background Circles */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-300 opacity-20 rounded-full -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-pink-300 opacity-20 rounded-full bottom-0 right-0 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-5">
        <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-white border-opacity-20">
          {/* Header Section */}
          <div className="flex items-center mb-8">
            <motion.div
              className="w-24 h-24 rounded-full overflow-hidden mr-5"
              variants={avatarVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <img
                src={userInfo.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div>
              <motion.h1
                className="text-4xl font-extrabold text-white"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                {"Hồ Sơ Của Tôi".split("").map((char, index) => (
                  <motion.span key={index} variants={letterVariants}>
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.p
                className="text-white text-opacity-80"
                variants={greetingVariants}
                initial="hidden"
                animate="visible"
              >
                Xin chào, {userInfo.name}!
              </motion.p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-5 border-b border-white border-opacity-20 mb-8 flex-wrap">
            {["info", "orders", "notifications", "vouchers", "account"].map(
              (tab, index) => (
                <motion.button
                  key={tab}
                  custom={index}
                  variants={tabButtonVariants}
                  initial="initial"
                  animate={activeTab === tab ? "active" : "animate"}
                  whileHover="hover"
                  whileTap="tap"
                  className={`pb-2 text-lg font-medium ${
                    activeTab === tab
                      ? "text-pink-500 border-b-2 border-pink-500"
                      : "text-white text-opacity-70"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "info" && "Thông Tin Cá Nhân"}
                  {tab === "orders" && "Đơn Mua"}
                  {tab === "notifications" && "Thông Báo"}
                  {tab === "vouchers" && "Kho Voucher"}
                  {tab === "account" && "Tài Khoản"}
                </motion.button>
              )
            )}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "info" && (
              <motion.div
                key="info"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {isEditing ? (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-white">
                      Chỉnh Sửa Thông Tin
                    </h2>
                    {error && (
                      <motion.div
                        className="text-red-300 mb-4 text-center animate-shake"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {error}
                      </motion.div>
                    )}
                    <form
                      onSubmit={handleEditSubmit}
                      encType="multipart/form-data"
                      className="space-y-6"
                    >
                      {/* Avatar */}
                      <motion.div
                        custom={0}
                        variants={inputVariants}
                        initial="hidden"
                        animate={error ? "error" : "visible"}
                        className="flex flex-col items-center"
                      >
                        <label className="block text-sm font-medium mb-2 text-white text-opacity-70">
                          Ảnh Đại Diện
                        </label>
                        <motion.div
                          className="w-24 h-24 rounded-full overflow-hidden mb-3"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <motion.input
                          type="file"
                          accept="image/*"
                          multiple
                          className="w-full text-white text-opacity-70 py-2 px-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-500 file:text-white file:hover:bg-pink-600 transition-all duration-300"
                          onChange={handleImageChange}
                          whileFocus="focus"
                        />
                      </motion.div>

                      {/* Name */}
                      <motion.div
                        custom={1}
                        variants={inputVariants}
                        initial="hidden"
                        animate={error ? "error" : "visible"}
                        className="relative"
                      >
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-50 py-2 px-3 focus:outline-none focus:border-pink-400 transition-all duration-300 peer"
                          placeholder=" "
                          required
                        />
                        <label className="absolute left-3 top-2 text-white text-opacity-70 text-sm transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-pink-400">
                          Họ và Tên
                        </label>
                      </motion.div>

                      {/* Email (Disabled) */}
                      <motion.div
                        custom={2}
                        variants={inputVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative"
                      >
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white text-opacity-50 py-2 px-3 focus:outline-none transition-all duration-300 peer cursor-not-allowed"
                          placeholder=" "
                          disabled
                        />
                        <label className="absolute left-3 top-2 text-white text-opacity-70 text-sm transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-pink-400">
                          Email
                        </label>
                      </motion.div>

                      {/* Phone */}
                      <motion.div
                        custom={3}
                        variants={inputVariants}
                        initial="hidden"
                        animate={
                          error &&
                          editForm.phone &&
                          !/^[0-9]{10}$/.test(editForm.phone)
                            ? "error"
                            : "visible"
                        }
                        className="relative"
                      >
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-50 py-2 px-3 focus:outline-none focus:border-pink-400 transition-all duration-300 peer"
                          placeholder=" "
                        />
                        <label className="absolute left-3 top-2 text-white text-opacity-70 text-sm transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-pink-400">
                          Số Điện Thoại
                        </label>
                      </motion.div>

                      {/* Address */}
                      <motion.div
                        custom={4}
                        variants={inputVariants}
                        initial="hidden"
                        animate={error ? "error" : "visible"}
                        className="relative"
                      >
                        <input
                          type="text"
                          name="address"
                          value={editForm.address}
                          onChange={handleEditChange}
                          className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-50 py-2 px-3 focus:outline-none focus:border-pink-400 transition-all duration-300 peer"
                          placeholder=" "
                        />
                        <label className="absolute left-3 top-2 text-white text-opacity-70 text-sm transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-pink-400">
                          Địa Chỉ
                        </label>
                      </motion.div>

                      <div className="flex gap-4">
                        <motion.button
                          type="submit"
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                          variants={buttonVariants}
                          initial="initial"
                          animate="animate"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Lưu
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                          variants={buttonVariants}
                          initial="initial"
                          animate="animate"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Hủy
                        </motion.button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-white">
                      Thông Tin Cá Nhân
                    </h2>
                    <div className="space-y-4 text-white text-opacity-90">
                      {[
                        { label: "Họ và Tên", value: userInfo.name },
                        { label: "Email", value: userInfo.email },
                        {
                          label: "Số Điện Thoại",
                          value: userInfo.phone || "Chưa cập nhật",
                        },
                        {
                          label: "Địa Chỉ",
                          value: userInfo.address || "Chưa cập nhật",
                        },
                      ].map((item, index) => (
                        <motion.p
                          key={index}
                          custom={index}
                          variants={infoItemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex gap-2"
                        >
                          <strong>{item.label}:</strong> {item.value}
                        </motion.p>
                      ))}
                    </div>
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      className="mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 animate-pulse-button"
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Chỉnh Sửa Thông Tin
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CustomerOrder />
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Notifications />
              </motion.div>
            )}

            {activeTab === "vouchers" && (
              <motion.div
                key="vouchers"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Vouchers />
              </motion.div>
            )}

            {activeTab === "account" && (
              <motion.div
                key="account"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AccountSettings />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;