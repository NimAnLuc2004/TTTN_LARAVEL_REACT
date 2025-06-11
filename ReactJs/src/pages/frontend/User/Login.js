import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../../services/Userservice";
import { GoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";

const clientId =
  process.env.REACT_APP_GOOGLE_CLIENT_ID;

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const navigate = useNavigate();

  // Hàm tính thời gian khóa dựa trên số lần thử thất bại
  const getLockoutDuration = (attempts) => {
    if (attempts >= 20) return 40 * 60 * 1000; // 40 phút
    if (attempts >= 15) return 20 * 60 * 1000; // 20 phút
    if (attempts >= 10) return 10 * 60 * 1000; // 10 phút
    if (attempts >= 5) return 5 * 60 * 1000;  // 5 phút
    return 0;
  };

  // Kiểm tra trạng thái khóa khi tải component
  useEffect(() => {
    const storedAttempts = localStorage.getItem("failedLoginAttempts");
    const storedLockout = localStorage.getItem("lockoutUntil");
    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts, 10));
    }
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout, 10);
      if (lockoutTime > Date.now()) {
        setLockoutUntil(lockoutTime);
      } else {
        localStorage.removeItem("failedLoginAttempts");
        localStorage.removeItem("lockoutUntil");
        setFailedAttempts(0);
        setLockoutUntil(null);
      }
    }
  }, []);

  // Đếm ngược thời gian khóa
  useEffect(() => {
    let timer;
    if (lockoutUntil) {
      timer = setInterval(() => {
        if (Date.now() >= lockoutUntil) {
          setLockoutUntil(null);
          setFailedAttempts(0);
          localStorage.removeItem("failedLoginAttempts");
          localStorage.removeItem("lockoutUntil");
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutUntil]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Kiểm tra trạng thái khóa
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
      setError(`Tài khoản bị khóa. Vui lòng thử lại sau ${remainingTime} phút.`);
      toast.error(`Tài khoản bị khóa. Vui lòng thử lại sau ${remainingTime} phút.`);
      return;
    }

    // Kiểm tra thông tin đầu vào
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Kiểm tra CAPTCHA
    if (!captchaToken) {
      setError("Vui lòng xác minh CAPTCHA");
      toast.error("Vui lòng xác minh CAPTCHA");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await UserService.login({ email, password, captchaToken });

      if (result.status) {
        // Đăng nhập thành công, reset số lần thử thất bại
        localStorage.setItem("token", JSON.stringify(result.token));
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.removeItem("failedLoginAttempts");
        localStorage.removeItem("lockoutUntil");
        setFailedAttempts(0);
        setLockoutUntil(null);

        toast.success("Đăng nhập thành công!");
        navigate("/");
        window.location.reload();
      } else {
        // Đăng nhập thất bại, tăng số lần thử thất bại
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem("failedLoginAttempts", newAttempts);
        const lockoutDuration = getLockoutDuration(newAttempts);
        if (lockoutDuration > 0) {
          const lockoutTime = Date.now() + lockoutDuration;
          setLockoutUntil(lockoutTime);
          localStorage.setItem("lockoutUntil", lockoutTime);
          setError(`Tài khoản bị khóa ${lockoutDuration / 1000 / 60} phút do quá nhiều lần thử thất bại.`);
          toast.error(`Tài khoản bị khóa ${lockoutDuration / 1000 / 60} phút do quá nhiều lần thử thất bại.`);
        } else {
          setError(result.message);
          toast.error(result.message);
        }
      }
    } catch (error) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem("failedLoginAttempts", newAttempts);
      const lockoutDuration = getLockoutDuration(newAttempts);
      if (lockoutDuration > 0) {
        const lockoutTime = Date.now() + lockoutDuration;
        setLockoutUntil(lockoutTime);
        localStorage.setItem("lockoutUntil", lockoutTime);
        setError(`Tài khoản bị khóa ${lockoutDuration / 1000 / 60} phút do quá nhiều lần thử thất bại.`);
        toast.error(`Tài khoản bị khóa ${lockoutDuration / 1000 / 60} phút do quá nhiều lần thử thất bại.`);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại");
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setIsLoading(false);
      setCaptchaToken(null); // Reset CAPTCHA sau mỗi lần thử
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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError("Vui lòng nhập email");
      toast.error("Vui lòng nhập email");
      return;
    }

    setForgotError("");
    setIsSendingReset(true);

    try {
      const result = await UserService.forgotPassword({ email: forgotEmail });

      if (result.status) {
        toast.success("Email đặt lại mật khẩu đã được gửi!");
        setShowForgotPassword(false);
        setForgotEmail("");
      } else {
        setForgotError(
          result.message || "Không thể gửi email, vui lòng thử lại."
        );
        toast.error(result.message || "Không thể gửi email, vui lòng thử lại.");
      }
    } catch (error) {
      setForgotError("Có lỗi xảy ra, vui lòng thử lại");
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      console.error("Lỗi quên mật khẩu:", error);
    } finally {
      setIsSendingReset(false);
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
            disabled={isLoading || (lockoutUntil && Date.now() < lockoutUntil)}
            required
          />
          <InputField
            label="Mật Khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading || (lockoutUntil && Date.now() < lockoutUntil)}
            required
          />
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
              hl="vi"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-button"
            disabled={isLoading || (lockoutUntil && Date.now() < lockoutUntil)}
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

        <p className="flex justify-center text-white text-opacity-80 mt-4 text-sm sm:text-base">
          <button
            type="button"
            className="text-pink-300 hover:text-pink-400 transition-colors duration-200"
            onClick={() => setShowForgotPassword(true)}
          >
            Quên mật khẩu?
          </button>
        </p>

        <p className="text-center text-white text-opacity-80 mt-2 text-sm sm:text-base">
          Chưa có tài khoản?{" "}
          <a
            href="/register"
            className="text-pink-300 hover:text-pink-400 transition-colors duration-200"
          >
            Đăng ký
          </a>
        </p>

        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
              <h3 className="text-2xl font-bold text-center text-white mb-6">
                Đặt Lại Mật Khẩu
              </h3>
              {forgotError && (
                <p
                  className="text-red-300 text-sm mb-4 text-center animate-shake"
                  role="alert"
                >
                  {forgotError}
                </p>
              )}
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                <InputField
                  label="Email"
                  type="email"
                  name="forgotEmail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  disabled={isSendingReset}
                  required
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-600 transition-all duration-300"
                    onClick={() => setShowForgotPassword(false)}
                    disabled={isSendingReset}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSendingReset}
                    aria-busy={isSendingReset}
                  >
                    {isSendingReset ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
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
                        Đang gửi...
                      </div>
                    ) : (
                      "Gửi Email"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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