import React, { useState } from "react";
import UserService from "../../../services/Userservice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi của trường khi người dùng nhập
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Kiểm tra định dạng và kích thước ảnh tại client
    const validImages = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidType = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
      if (!isImage || !isValidType) {
        toast.error(
          `Tệp ${file.name} không phải định dạng jpeg, png, jpg hoặc webp.`
        );
        return false;
      }
      if (!isValidSize) {
        toast.error(`Tệp ${file.name} vượt quá 2MB.`);
        return false;
      }
      return true;
    });
    setImages(validImages);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra cơ bản tại client
    const clientErrors = {};
    if (!formData.name) clientErrors.name = "Tên là bắt buộc.";
    if (!formData.email) clientErrors.email = "Email là bắt buộc.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      clientErrors.email = "Email không hợp lệ.";
    if (!formData.password) clientErrors.password = "Mật khẩu là bắt buộc.";
    else if (formData.password.length < 8)
      clientErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    if (!formData.address) clientErrors.address = "Địa chỉ là bắt buộc.";
    if (!formData.phone) clientErrors.phone = "Số điện thoại là bắt buộc.";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      clientErrors.phone = "Số điện thoại phải có đúng 10 chữ số.";
    if (images.length === 0)
      clientErrors.image = "Vui lòng tải lên ít nhất một ảnh.";

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      Object.values(clientErrors).forEach((error) => toast.error(error));
      return;
    }

    setErrors({});
    setIsLoading(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("address", formData.address);
    submitData.append("phone", formData.phone);
    images.forEach((image) => submitData.append("image[]", image));

    try {
      const result = await UserService.register(submitData);

      if (result.status) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        // Xử lý lỗi từ API
        if (result.errors) {
          const apiErrors = {};
          for (const [field, messages] of Object.entries(result.errors)) {
            apiErrors[field] = messages[0]; // Lấy thông báo lỗi đầu tiên
          }
          setErrors(apiErrors);
          Object.values(apiErrors).forEach((error) => toast.error(error));
        } else {
          setErrors({ general: result.message });
          toast.error(result.message);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định.";
      setErrors({ general: "Có lỗi xảy ra, vui lòng thử lại." });
      toast.error(`${errorMessage}`);
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-300 opacity-20 rounded-full -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-pink-300 opacity-20 rounded-full bottom-0 right-0 animate-pulse delay-1000"></div>
      </div>

      {/* Register Card */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20 sm:p-8">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6 animate-fade-in sm:text-4xl">
          Đăng Ký
        </h2>

        {/* General Error */}
        {errors.general && (
          <p className="text-red-300 text-sm mb-4 text-center animate-shake">
            {errors.general}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              name="name"
              className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-50 py-2 px-3 focus:outline-none focus:border-pink-400 transition-all duration-300 peer text-sm sm:text-base"
              placeholder=" "
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            <label className="absolute left-3 top-2 text-white text-opacity-70 text-xs transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-pink-400 sm:peer-placeholder-shown:text-base sm:peer-focus:text-sm">
              Họ Tên
            </label>
            {errors.name && (
              <p className="text-red-300 text-xs mt-1 animate-shake">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="email"
              className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-50 py-2 px-3 focus:outline-none focus:border-pink-400 transition-all duration-300 peer text-sm sm:text-base"
              placeholder=" "
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            <label className="absolute left-3 top-2 text-white text-opacity-70 text-xs transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-pink-400 sm:peer-placeholder-shown:text-base sm:peer-focus:text-sm">
              Email
            </label>
            {errors.email && (
              <p className="text-red-300 text-xs mt-1 animate-shake">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="password"
              className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-50 py-2 px-3 focus:outline-none focus:border-pink-400 transition-all duration-300 peer text-sm sm:text-base"
              placeholder=" "
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            <label className="absolute left-3 top-2 text-white text-opacity-70 text-xs transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-pink-400 sm:peer-placeholder-shown:text-base sm:peer-focus:text-sm">
              Mật Khẩu (Tối thiểu 8 ký tự)
            </label>
            {errors.password && (
              <p className="text-red-300 text-xs mt-1 animate-shake">
                {errors.password}
              </p>
            )}
          </div>

          {/* Image Input */}
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              multiple
              className="w-full text-white text-opacity-70 py-2 px-3 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-pink-500 file:text-white file:hover:bg-pink-600 transition-all duration-300 text-xs sm:text-sm"
              onChange={handleImageChange}
              disabled={isLoading}
            />
            <label className="block text-white text-opacity-70 text-xs mt-2 sm:text-sm">
              Ảnh Đại Diện (jpeg, png, jpg, webp, tối đa 2MB)
            </label>
            {errors.image && (
              <p className="text-red-300 text-xs mt-1 animate-shake">
                {errors.image}
              </p>
            )}
          </div>

          {/* Address Input */}
          <div className="relative">
            <input
              type="text"
              name="address"
              className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-50 py-2 px-3 focus:outline-none focus:border-pink-400 transition-all duration-300 peer text-sm sm:text-base"
              placeholder=" "
              value={formData.address}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            <label className="absolute left-3 top-2 text-white text-opacity-70 text-xs transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-pink-400 sm:peer-placeholder-shown:text-base sm:peer-focus:text-sm">
              Địa Chỉ Giao Hàng
            </label>
            {errors.address && (
              <p className="text-red-300 text-xs mt-1 animate-shake">
                {errors.address}
              </p>
            )}
          </div>

          {/* Phone Input */}
          <div className="relative">
            <input
              type="tel"
              name="phone"
              className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-50 py-2 px-3 focus:outline-none focus:border-pink-400 transition-all duration-300 peer text-sm sm:text-base"
              placeholder=" "
              value={formData.phone}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            <label className="absolute left-3 top-2 text-white text-opacity-70 text-xs transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-pink-400 sm:peer-placeholder-shown:text-base sm:peer-focus:text-sm">
              Số Điện Thoại (10 số)
            </label>
            {errors.phone && (
              <p className="text-red-300 text-xs mt-1 animate-shake">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2.5 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-button text-sm sm:text-base sm:py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white sm:h-5 sm:w-5 sm:mr-3"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </div>
            ) : (
              "Đăng Ký"
            )}
          </button>
        </form>

        {/* Signin Link */}
        <p className="text-center text-white text-opacity-80 mt-4 text-xs sm:text-sm">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-pink-300 hover:text-pink-400 transition-colors duration-200"
          >
            Đăng nhập
          </a>
        </p>
      </div>

      {/* Custom CSS for Animations and Responsive */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        @keyframes pulse-button {
          0% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(236, 72, 153, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-pulse-button {
          animation: pulse-button 1.5s infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .max-w-md {
            max-width: 90vw;
            padding: 1.5rem;
          }
          .text-4xl {
            font-size: 1.75rem;
          }
          .space-y-6 {
            space-y: 4;
          }
          input,
          button {
            font-size: 0.875rem;
          }
          label {
            font-size: 0.75rem;
          }
          .peer-placeholder-shown:text-base {
            font-size: 0.875rem;
          }
          .peer-focus:text-sm {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
