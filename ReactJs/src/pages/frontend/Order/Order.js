import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = () => {
  const [shippingInfo, setShippingInfo] = useState({
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [checkoutData, setCheckoutData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://127.0.0.1:8000/api/frontend";
  const urlImage = "http://127.0.0.1:8000/images/product/";

  const token = (localStorage.getItem("token") || "").replace(/^"|"$/g, "");
  const isAuthenticated = !!token;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setError("Vui lòng đăng nhập để tiếp tục thanh toán.");
        setLoading(false);
        return;
      }

      try {
        const data = JSON.parse(localStorage.getItem("checkoutOrder"));
        if (
          !data ||
          !data.order ||
          !data.payment ||
          !data.selectedItems ||
          !data.selectedItems.length
        ) {
          setError(
            "Không tìm thấy thông tin đơn hàng hoặc danh sách sản phẩm rỗng. Vui lòng quay lại giỏ hàng."
          );
          setLoading(false);
          return;
        }

        const updatedItems = data.selectedItems.map((item) => {
          const imagePath =
            item.image && typeof item.image === "string" && item.image.trim()
              ? item.image.includes(urlImage)
                ? item.image
                : `${urlImage}${item.image}`
              : "/placeholder-image.png";

          return {
            ...item,
            image: imagePath,
          };
        });

        setCheckoutData({ ...data, selectedItems: updatedItems });
        setPaymentMethod(data.payment.payment_method || "VNPay");

        // Gọi API để lấy địa chỉ
        try {
          const addressResponse = await axios.get(`${API_URL}/order/address`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Chỉ cập nhật shippingInfo nếu API trả về địa chỉ hợp lệ
          if (
            addressResponse.data.status &&
            addressResponse.data.data &&
            addressResponse.data.data.phone &&
            addressResponse.data.data.address
          ) {
            setShippingInfo({
              phone: addressResponse.data.data.phone,
              address: addressResponse.data.data.address,
            });
          } else {
            // Nếu không có địa chỉ hợp lệ, giữ shippingInfo trống
            setShippingInfo({
              phone: "",
              address: "",
            });
          }
        } catch (addressError) {
          // Nếu API trả về lỗi (ví dụ: 404, 500), giữ shippingInfo trống
          console.warn(
            "Không thể lấy địa chỉ:",
            addressError.response?.data || addressError
          );
          setShippingInfo({
            phone: "",
            address: "",
          });
        }

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
            : err.message === "Network Error"
            ? "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
            : err.response?.data?.message ||
              "Lỗi khi tải thông tin đơn hàng hoặc địa chỉ. Vui lòng thử lại."
        );
        toast.error(
          err.response?.status === 401
            ? "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
            : err.message === "Network Error"
            ? "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
            : err.response?.data?.message ||
              "Lỗi khi tải thông tin đơn hàng hoặc địa chỉ. Vui lòng thử lại.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        setLoading(false);
        console.error("Error fetching data:", err.response?.data || err);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const shippingFee = 30000;
  const total = checkoutData ? checkoutData.totalPrice + shippingFee : 0;

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!checkoutData) {
      setError("Không có thông tin đơn hàng.");
      toast.error("Không có thông tin đơn hàng.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!shippingInfo.phone || !phoneRegex.test(shippingInfo.phone)) {
      setError("Vui lòng nhập số điện thoại hợp lệ (10-11 số).");
      toast.error("Vui lòng nhập số điện thoại hợp lệ (10-11 số).", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!shippingInfo.address || shippingInfo.address.trim().length < 10) {
      setError("Vui lòng nhập địa chỉ hợp lệ (tối thiểu 10 ký tự).");
      toast.error("Vui lòng nhập địa chỉ hợp lệ (tối thiểu 10 ký tự).", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const confirmOrder = window.confirm(
      "Bạn có chắc chắn muốn đặt hàng không?"
    );
    if (!confirmOrder) {
      return; // Thoát nếu người dùng hủy
    }

    if (!checkoutData) {
      setError("Không có thông tin đơn hàng.");
      toast.error("Không có thông tin đơn hàng.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const orderPayload = {
        user_id: JSON.parse(localStorage.getItem("user") || "{}").id,
        products: checkoutData.selectedItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
        code: checkoutData.selectedItems[0]?.discountCode || null,
      };

      const orderResponse = await axios.post(
        `${API_URL}/order/add`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.status) {
        setError(orderResponse.data.message || "Không thể tạo đơn hàng.");
        toast.error(orderResponse.data.message || "Không thể tạo đơn hàng.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const orderId = orderResponse.data.data.order.id;

      const addressResponse = await axios.post(
        `${API_URL}/order/add-address`,
        {
          phone: shippingInfo.phone,
          address: shippingInfo.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!addressResponse.data.status) {
        setError(addressResponse.data.message || "Không thể thêm địa chỉ.");
        toast.error(addressResponse.data.message || "Không thể thêm địa chỉ.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const confirmResponse = await axios.patch(
        `${API_URL}/order/${orderId}/confirm`,
        { payment_method: paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (confirmResponse.data.status) {
        localStorage.removeItem("checkoutOrder");

        if (confirmResponse.data.data.dsjs) {
          window.location.href = confirmResponse.data.data.payment_url; // Redirect to payment URL
        } else {
          toast.success("Đặt hàng thành công!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          navigate("/profile", { state: { activeTab: "orders" } });
        }
      } else {
        setError(
          confirmResponse.data.message || "Không thể xác nhận đơn hàng."
        );
        toast.error(
          confirmResponse.data.message || "Không thể xác nhận đơn hàng.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
          : err.response?.data?.message ||
              "Không thể hoàn tất đơn hàng. Vui lòng thử lại."
      );
      toast.error(
        err.response?.status === 401
          ? "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
          : err.response?.data?.message ||
              "Không thể hoàn tất đơn hàng. Vui lòng thử lại.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      console.error("Error placing order:", err.response?.data || err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-lg mt-4">
            Đang tải thông tin thanh toán...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
          {error.includes("đăng nhập lại") ? (
            <a
              href="/login"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Đăng nhập lại
            </a>
          ) : (
            <a
              href="/cart"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Quay lại giỏ hàng
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-5">Thanh toán</h1>

      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h2 className="text-lg font-semibold mb-3 text-orange-500">
          Địa chỉ nhận hàng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập địa chỉ giao hàng"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h2 className="text-lg font-semibold mb-3">Sản phẩm</h2>
        <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-600 mb-3">
          <div className="col-span-5">Sản phẩm</div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-3 text-center">Thành tiền</div>
        </div>
        {checkoutData?.selectedItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-3 items-center text-sm border-t border-gray-200 pt-3"
          >
            <div className="col-span-5 flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md mr-3"
                onError={(e) => {
                  e.target.src = "/placeholder-image.png";
                }}
              />
              <div>
                <p className="font-medium truncate">{item.name}</p>
              </div>
            </div>
            <div className="col-span-2 text-center">
              {item.price.toLocaleString()} ₫
            </div>
            <div className="col-span-2 text-center">{item.quantity}</div>
            <div className="col-span-3 text-center text-orange-500 font-semibold">
              {(item.price * item.quantity).toLocaleString()} ₫
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h2 className="text-lg font-semibold mb-3">Phương thức thanh toán</h2>
        <div className="flex flex-wrap gap-5">
          {["VNPay", "Momo", "Paypal", "Stripe"].map((method) => (
            <label key={method} className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              {method}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm flex justify-between items-center">
        <div className="text-sm">
          <p className="mb-1">
            Tổng tiền hàng:{" "}
            <span className="font-semibold">
              {checkoutData?.totalPrice.toLocaleString()} ₫
            </span>
          </p>
          <p className="mb-1">
            Phí vận chuyển:{" "}
            <span className="font-semibold">
              {shippingFee.toLocaleString()} ₫
            </span>
          </p>
          <p>
            Tổng thanh toán:{" "}
            <span className="text-orange-500 text-xl font-semibold">
              {total.toLocaleString()} ₫
            </span>
          </p>
        </div>
        <button
          onClick={handlePlaceOrder}
          className="bg-orange-500 text-white px-5 py-3 rounded-md hover:bg-orange-600 transition"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default Order;
