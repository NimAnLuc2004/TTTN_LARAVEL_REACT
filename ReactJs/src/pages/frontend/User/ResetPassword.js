import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../../services/Userservice";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  disabled,
  required,
}) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      className="w-full bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-50 py-2 px-3 focus:outline-none focus:border-pink-400 transition-all duration-300 peer"
      placeholder=" "
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      aria-label={label}
    />
    <label className="absolute left-3 top-2 text-white text-opacity-70 text-sm transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-pink-400">
      {label}
    </label>
  </div>
);

const ResetPassword = () => {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and email from URL query parameters
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const email = query.get("email");

  useEffect(() => {
    if (!token || !email) {
      setError("Liên kết không hợp lệ. Vui lòng thử lại.");
      toast.error("Liên kết không hợp lệ. Vui lòng thử lại.");
    }
  }, [token, email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      toast.error("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await UserService.resetPassword({
        email,
        token,
        password,
      });

      if (result.status) {
        toast.success("Đặt lại mật khẩu thành công!");
        navigate("/login");
      } else {
        setError(result.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
        toast.error(result.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-300 opacity-20 rounded-full -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-pink-300 opacity-20 rounded-full bottom-0 right-0 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-8 animate-fade-in">
          Đặt Lại Mật Khẩu
        </h2>

        {error && (
          <p
            className="text-red-300 text-sm mb-4 text-center animate-shake"
            role="alert"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Mật Khẩu Mới"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <InputField
            label="Xác Nhận Mật Khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang xử lý...
              </div>
            ) : (
              "Đặt Lại Mật Khẩu"
            )}
          </button>
        </form>

        <p className="text-center text-white text-opacity-80 mt-6 text-sm sm:text-base">
          Quay lại{" "}
          <a
            href="/login"
            className="text-pink-300 hover:text-pink-400 transition-colors duration-200"
          >
            Đăng nhập
          </a>
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes pulse-button {
          0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(236, 72, 153, 0); }
          100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-pulse-button { animation: pulse-button 1.5s infinite; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default ResetPassword;