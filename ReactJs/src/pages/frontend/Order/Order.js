import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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
  const PAYPAL_CLIENT_ID =
    "ARFXrVtQcBkpeF-cIlEIc_RtS3lRfmRfAXwY6K3vceUdgRJ1BvUfvsioMVGnDDHpnTMYuCjjApZiL8-m";

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

        const stockCheckPayload = {
          products: data.selectedItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        };

        const stockResponse = await axios.post(
          `${API_URL}/order/check-stock`,
          stockCheckPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!stockResponse.data.status) {
          setError(
            stockResponse.data.message || "Không đủ hàng cho một số sản phẩm."
          );
          toast.error(
            stockResponse.data.message || "Không đủ hàng cho một số sản phẩm.",
            {
              position: "top-right",
              autoClose: 3000,
            }
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

        try {
          const addressResponse = await axios.get(`${API_URL}/order/address`, {
            headers: { Authorization: `Bearer ${token}` },
          });

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
            setShippingInfo({
              phone: "",
              address: "",
            });
          }
        } catch (addressError) {
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

  const checkStockBeforePayment = async () => {
    try {
      const stockCheckPayload = {
        products: checkoutData.selectedItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const stockResponse = await axios.post(
        `${API_URL}/order/check-stock`,
        stockCheckPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return stockResponse.data.status;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thể kiểm tra tồn kho.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return false;
    }
  };

  const createVNPayOrder = async () => {
    try {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!shippingInfo.phone || !phoneRegex.test(shippingInfo.phone)) {
        throw new Error("Vui lòng nhập số điện thoại hợp lệ (10-11 số).");
      }

      if (!shippingInfo.address || shippingInfo.address.trim().length < 10) {
        throw new Error("Vui lòng nhập địa chỉ hợp lệ (tối thiểu 10 ký tự).");
      }

      const isStockAvailable = await checkStockBeforePayment();
      if (!isStockAvailable) {
        throw new Error("Không đủ hàng cho một số sản phẩm.");
      }

      const confirmOrder = window.confirm(
        "Bạn có chắc chắn muốn thanh toán bằng VNPay không?"
      );
      if (!confirmOrder) {
        throw new Error("Thanh toán bị hủy.");
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;

      const orderPayload = {
        user_id: userId,
        products: checkoutData.selectedItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: "VNPay",
        code: checkoutData.selectedItems[0]?.discountCode || null,
      };

      const orderResponse = await axios.post(
        `${API_URL}/order/add`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.status) {
        throw new Error(
          orderResponse.data.message || "Không thể tạo đơn hàng."
        );
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
        throw new Error(
          addressResponse.data.message || "Không thể thêm địa chỉ."
        );
      }

      const confirmResponse = await axios.patch(
        `${API_URL}/order/${orderId}/confirm`,
        { payment_method: "VNPay" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (
        !confirmResponse.data.status ||
        !confirmResponse.data.data.payment_url
      ) {
        throw new Error(
          confirmResponse.data.message || "Không thể tạo URL thanh toán VNPay."
        );
      }

      toast.info("Đang chuyển hướng đến cổng thanh toán VNPay...", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        window.location.href = confirmResponse.data.data.payment_url;
      }, 1000);
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
          : err.response?.data?.message ||
            err.message ||
            "Không thể tạo đơn hàng VNPay.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error creating VNPay order:", err.response?.data || err);
    }
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
      return;
    }

    try {
      if (paymentMethod === "COD") {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id;

        const orderPayload = {
          user_id: userId,
          products: checkoutData.selectedItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          payment_method: "COD",
          code: checkoutData.selectedItems[0]?.discountCode || null,
        };

        const orderResponse = await axios.post(
          `${API_URL}/order/add`,
          orderPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!orderResponse.data.status) {
          throw new Error(
            orderResponse.data.message || "Không thể tạo đơn hàng."
          );
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
          throw new Error(
            addressResponse.data.message || "Không thể thêm địa chỉ."
          );
        }

        const confirmResponse = await axios.patch(
          `${API_URL}/order/${orderId}/confirm`,
          { payment_method: "COD" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (confirmResponse.data.status) {
          localStorage.removeItem("checkoutOrder");
          toast.success(
            "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          navigate("/profile", { state: { activeTab: "orders" } });
        } else {
          throw new Error(
            confirmResponse.data.message || "Không thể xác nhận đơn hàng."
          );
        }
      } else if (paymentMethod === "Momo" || paymentMethod === "Stripe") {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id;

        const orderPayload = {
          user_id: userId,
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
          throw new Error(
            orderResponse.data.message || "Không thể tạo đơn hàng."
          );
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
          throw new Error(
            addressResponse.data.message || "Không thể thêm địa chỉ."
          );
        }

        const confirmResponse = await axios.patch(
          `${API_URL}/order/${orderId}/confirm`,
          { payment_method: paymentMethod },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (confirmResponse.data.status) {
          localStorage.removeItem("checkoutOrder");
          if (confirmResponse.data.data.payment_url) {
            window.location.href = confirmResponse.data.data.payment_url;
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
          throw new Error(
            confirmResponse.data.message || "Không thể xác nhận đơn hàng."
          );
        }
      } else {
        throw new Error("Vui lòng chọn phương thức thanh toán hợp lệ.");
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

  const createPayPalOrder = async () => {
    try {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!shippingInfo.phone || !phoneRegex.test(shippingInfo.phone)) {
        throw new Error("Vui lòng nhập số điện thoại hợp lệ (10-11 số).");
      }

      if (!shippingInfo.address || shippingInfo.address.trim().length < 10) {
        throw new Error("Vui lòng nhập địa chỉ hợp lệ (tối thiểu 10 ký tự).");
      }

      const isStockAvailable = await checkStockBeforePayment();
      if (!isStockAvailable) {
        throw new Error("Không đủ hàng cho một số sản phẩm.");
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;

      const orderPayload = {
        user_id: userId,
        products: checkoutData.selectedItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: "Paypal",
        code: checkoutData.selectedItems[0]?.discountCode || null,
      };

      const orderResponse = await axios.post(
        `${API_URL}/order/add`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.status) {
        throw new Error(
          orderResponse.data.message || "Không thể tạo đơn hàng."
        );
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
        throw new Error(
          addressResponse.data.message || "Không thể thêm địa chỉ."
        );
      }

      return orderId.toString();
    } catch (err) {
      toast.error(err.message || "Không thể tạo đơn hàng PayPal.", {
        position: "top-right",
        autoClose: 3000,
      });
      throw err;
    }
  };

  const onApprovePayPal = async (orderId) => {
    try {
      if (isNaN(orderId) || orderId <= 0) {
        throw new Error("ID đơn hàng không hợp lệ.");
      }

      const confirmResponse = await axios.patch(
        `${API_URL}/order/${orderId}/confirm`,
        { payment_method: "Paypal" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (confirmResponse.data.status) {
        localStorage.removeItem("checkoutOrder");
        toast.success("Thanh toán PayPal thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/profile", { state: { activeTab: "orders" } });
      } else {
        throw new Error(
          confirmResponse.data.message || "Không thể xác nhận đơn hàng."
        );
      }
    } catch (err) {
      toast.error(err.message || "Lỗi khi xác nhận thanh toán PayPal.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error confirming order:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-base mt-3">
            Đang tải thông tin thanh toán...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
          <p className="text-red-500 text-base font-medium mb-4">{error}</p>
          {error.includes("đăng nhập lại") ? (
            <a
              href="/login"
              className="inline-block bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
            >
              Đăng nhập lại
            </a>
          ) : (
            <a
              href="/cart"
              className="inline-block bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
            >
              Quay lại giỏ hàng
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-5">
      <ToastContainer />
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5">
        Thanh toán
      </h1>

      <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-orange-500">
          Địa chỉ nhận hàng
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              placeholder="Nhập địa chỉ giao hàng"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-semibold mb-3">Sản phẩm</h2>
        <div className="hidden sm:grid grid-cols-12 gap-3 text-sm font-medium text-gray-600 mb-3">
          <div className="col-span-5">Sản phẩm</div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-3 text-center">Thành tiền</div>
        </div>
        {checkoutData?.selectedItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:grid sm:grid-cols-12 gap-3 items-start sm:items-center text-sm border-t border-gray-200 pt-3"
          >
            <div className="flex items-center w-full sm:col-span-5">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md mr-3"
                onError={(e) => {
                  e.target.src = "/placeholder-image.png";
                }}
              />
              <div>
                <p className="font-medium truncate">{item.name}</p>
              </div>
            </div>
            <div className="flex justify-between w-full sm:col-span-7 sm:grid sm:grid-cols-7">
              <div className="sm:col-span-2 sm:text-center">
                <span className="sm:hidden font-medium">Đơn giá: </span>
                {item.price.toLocaleString()} ₫
              </div>
              <div className="sm:col-span-2 sm:text-center">
                <span className="sm:hidden font-medium">Số lượng: </span>
                {item.quantity}
              </div>
              <div className="sm:col-span-3 sm:text-center text-orange-500 font-semibold">
                <span className="sm:hidden font-medium">Thành tiền: </span>
                {(item.price * item.quantity).toLocaleString()} ₫
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-semibold mb-3">
          Phương thức thanh toán
        </h2>
        <div className="flex flex-col gap-3">
          {["VNPay", "Paypal", "COD", "Momo", "Stripe"].map((method) => (
            <label key={method} className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2 h-4 w-4"
              />
              <span className="text-sm">
                {method === "COD" ? "Thanh toán khi nhận hàng" : method}
              </span>
            </label>
          ))}
        </div>
      </div>

      {paymentMethod === "VNPay" && (
        <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-semibold mb-3">
            Thanh toán VNPay
          </h2>
          <button
            onClick={createVNPayOrder}
            className="w-full bg-blue-500 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-md hover:bg-blue-600 transition text-sm sm:text-base"
          >
            Thanh toán với VNPay
          </button>
        </div>
      )}

      {paymentMethod === "Paypal" && (
        <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-semibold mb-3">
            Thanh toán PayPal
          </h2>
          <PayPalScriptProvider
            options={{
              "client-id": PAYPAL_CLIENT_ID,
              currency: "USD",
              locale: "en_US",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={async (data, actions) => {
                const orderId = await createPayPalOrder();
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: (total / 23000).toFixed(2),
                        currency_code: "USD",
                      },
                      custom_id: orderId,
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                const orderId = details.purchase_units[0].custom_id;
                await onApprovePayPal(orderId);
              }}
              onError={(err) => {
                toast.error("Lỗi khi thanh toán PayPal. Vui lòng thử lại.", {
                  position: "top-right",
                  autoClose: 3000,
                });
                console.error("PayPal error:", err);
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}

      <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
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
            <span className="text-orange-500 text-lg sm:text-xl font-semibold">
              {total.toLocaleString()} ₫
            </span>
          </p>
        </div>
        {paymentMethod !== "Paypal" && paymentMethod !== "VNPay" && (
          <button
            onClick={handlePlaceOrder}
            className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-md hover:bg-orange-600 transition text-sm sm:text-base"
          >
            Đặt hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default Order;