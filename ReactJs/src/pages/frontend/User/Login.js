import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../../services/Userservice";
import { GoogleLogin } from "@react-oauth/google";

const clientId =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "316282318852-2rennockehs37c3aqsq8se3lbeqv2svr.apps.googleusercontent.com";

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

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await UserService.login({ email, password });

      if (result.status) {
        localStorage.setItem("token", JSON.stringify(result.token));
        localStorage.setItem("user", JSON.stringify(result.user));

        toast.success("Đăng nhập thành công!");

        navigate("/");
        window.location.reload();
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      console.error("Signin error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Không nhận được credential từ Google.");
      toast.error("Không nhận được credential từ Google.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await UserService.googleLogin({
        credential: credentialResponse.credential,
      });

      if (result.status) {
        localStorage.setItem("token", JSON.stringify(result.token));
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Đăng nhập bằng Google thành công!");

        navigate("/");
        window.location.reload();
      } else {
        setError(
          result.message ||
            result.error ||
            "Đăng nhập bằng Google không thành công."
        );
        toast.error(
          result.message ||
            result.error ||
            "Đăng nhập bằng Google không thành công."
        );
      }
    } catch (error) {
      setError("Lỗi đăng nhập bằng Google, vui lòng thử lại.");
      toast.error(
        "Lỗi đăng nhập bằng Google: " + (error.message || "Lỗi không xác định")
      );
      console.error("Lỗi đăng nhập Google:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Lỗi đăng nhập Google:", error);
    toast.error(
      "Đăng nhập bằng Google thất bại: " +
        (error.message || "Lỗi không xác định")
    );
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-300 opacity-20 rounded-full -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-pink-300 opacity-20 rounded-full bottom-0 right-0 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-8 animate-fade-in">
          Đăng Nhập
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
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <InputField
            label="Mật Khẩu"
            type="password"
            name="password"
            value={formData.password}
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
              "Đăng Nhập"
            )}
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <GoogleLogin
            clientId={clientId}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            onFailure={(error) =>
              console.error("Lỗi khởi tạo Google Sign-In:", error)
            }
            shape="pill"
            theme="filled_blue"
            size="large"
            text="continue_with"
            locale="vi"
            width="300"
          />
        </div>

        <p className="text-center text-white text-opacity-80 mt-6 text-sm sm:text-base">
          Chưa có tài khoản?{" "}
          <a
            href="/register"
            className="text-pink-300 hover:text-pink-400 transition-colors duration-200"
          >
            Đăng ký
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

export default Signin;
