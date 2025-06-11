import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate trực tiếp
  const [state, setState] = useState({
    isOpen: true,
    formData: {
      name: "",
      email: "",
      phone: "",
      title: "Newsletter Subscription",
      content: "Interested in receiving updates and offers.",
    },
    isSubmitting: false,
    token: (localStorage.getItem("token") || "").replace(/^"|"$/g, ""),
  });

  const handleCloseModal = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { formData, token } = state;

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (!token) {
      toast.warn("Vui lòng đăng nhập để đăng ký bản tin.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/frontend/contact",
        {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message || "Đăng ký thành công! Cảm ơn bạn đã đăng ký.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        setState((prev) => ({
          ...prev,
          formData: {
            name: "",
            email: "",
            phone: "",
            title: "Newsletter Subscription",
            content: "Interested in receiving updates and offers.",
          },
          isOpen: false,
        }));
      } else {
        const errorMessage =
          data.message || "Đăng ký thất bại. Vui lòng thử lại.";
        if (response.status === 401) {
          toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.", {
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const { isOpen, formData, isSubmitting } = state;

  return (
    <>
      <ToastContainer />
      {isOpen && (
        <div className="modal" data-modal="">
          <div className="modal-close-overlay" data-modal-overlay="" />
          <div className="modal-content">
            <button className="modal-close-btn" onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="newsletter-img">
              <img
                src={require("../../../assets/images/newsletter.png")}
                alt="đăng ký bản tin"
                width={500}
                height={500}
              />
            </div>
            <div className="newsletter">
              <form onSubmit={handleSubmit}>
                <div className="newsletter-header">
                  <h3 className="newsletter-title">Đăng ký nhận bản tin</h3>
                  <p className="newsletter-desc">
                    Đăng ký nhận bản tin từ <b>Anon</b> để nhận thông tin sản
                    phẩm mới nhất và ưu đãi.
                  </p>
                </div>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="Họ và tên"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="Địa chỉ email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  className="input-field"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="submit"
                  className="btn-newsletter"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;