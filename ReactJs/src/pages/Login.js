import React, { useState, useEffect } from "react";
import UserService from "../services/Userservice";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho loading
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setError("");
    setIsLoading(true); // Bật trạng thái loading

    try {
 
      const result = await UserService.loginadmin({ email, password });

      if (result.status) {
        setMessage(result.message);
        localStorage.setItem("token", JSON.stringify(result.token));
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Đăng nhập thành công!");
          setTimeout(() => {
        navigate("/admin");
      }, 1000); 
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Đăng Nhập
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading} // Vô hiệu hóa input khi loading
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật Khẩu
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading} // Vô hiệu hóa input khi loading
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            disabled={isLoading} // Vô hiệu hóa button khi loading
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
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
              "Đăng Nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;