import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("VNPay");

  const API_URL = "http://127.0.0.1:8000/api/frontend";
  const urlImage = "http://127.0.0.1:8000/images/";

  const { id: userId } = JSON.parse(localStorage.getItem("user") || "{}");
  const token = (localStorage.getItem("token") || "").replace(/^"|"$/g, "");

  const isAuthenticated = !!userId && !!token;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setError("Vui lòng đăng nhập để xem giỏ hàng.");
        toast.error("Vui lòng đăng nhập để xem giỏ hàng.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const cartResponse = await axios.get(`${API_URL}/cart/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartData = cartResponse.data.data.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.product?.product?.name || "Unknown Product",
          price: item.product?.price || 0,
          quantity: item.quantity,
          image: item.product?.product?.images?.[0]?.image_url
            ? `${urlImage}product/${item.product.product.images[0].image_url}`
            : "https://via.placeholder.com/80x80?text=Product",
          selected: false,
          discountCode: "",
        }));

        const discountResponse = await axios.get(`${API_URL}/discount`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCartItems(cartData);
        setDiscounts(discountResponse.data.data || []);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.status === 401
            ? "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
            : "Không thể tải dữ liệu giỏ hàng hoặc mã giảm giá.";
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [isAuthenticated, token, userId]);

  const handleSelectItem = (id) =>
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );

  const handleSelectAll = () => {
    const allSelected = cartItems.every((item) => item.selected);
    setCartItems(
      cartItems.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const handleQuantityChange = async (id, action) => {
    if (!isAuthenticated) {
      setError("Vui lòng đăng nhập để cập nhật giỏ hàng.");
      toast.error("Vui lòng đăng nhập để cập nhật giỏ hàng.");
      return;
    }

    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQuantity =
      action === "increase"
        ? item.quantity + 1
        : action === "decrease" && item.quantity > 1
        ? item.quantity - 1
        : item.quantity;

    if (newQuantity === item.quantity) return;

    try {
      const response = await axios.put(
        `${API_URL}/cart/quantity/${item.product_id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.id === id
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          )
        );
        
        toast.success("Cập nhật số lượng sản phẩm thành công!");
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      setError("Không thể cập nhật số lượng sản phẩm.");
      toast.error("Không thể cập nhật số lượng sản phẩm.");
      console.error("Error updating quantity:", err);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!isAuthenticated) {
      setError("Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng.");
      toast.error("Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng.");
      return;
    }

    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    try {
      const response = await axios.delete(
        `${API_URL}/cart/clear/${item.product_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        window.location.reload();
        setCartItems(cartItems.filter((cartItem) => cartItem.id !== id));
        toast.success("Xóa sản phẩm khỏi giỏ hàng thành công!");
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      setError("Không thể xóa sản phẩm khỏi giỏ hàng.");
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng.");
      console.error("Error deleting item:", err);
    }
  };

  const handleDiscountChange = (id, code) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, discountCode: code } : item
      )
    );
    if (code) {
      const discount = discounts.find((d) => d.code === code);
      toast.success(
        `Áp dụng mã giảm giá ${code} (${discount.discount_percent}%) thành công!`
      );
    } else {
      toast.info("Đã hủy mã giảm giá.");
    }
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    // Calculate total price with discounts
    const totalPrice = selectedItems.reduce((sum, item) => {
      const discountedPrice = getDiscountedPrice(item);
      return sum + discountedPrice * item.quantity;
    }, 0);

    // Prepare checkout data
    const checkoutData = {
      order: {
        id: null, // No order created yet
        totalPrice,
      },
      payment: {
        payment_method: paymentMethod,
      },
      selectedItems: selectedItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        image: item.image.replace(urlImage + "product/", ""), // Store relative path
        price: item.price,
        quantity: item.quantity,
        discountCode: item.discountCode,
      })),
      totalPrice,
    };

    // Save to localStorage
    localStorage.setItem("checkoutOrder", JSON.stringify(checkoutData));

    // Show success toast and navigate
    toast.success("Đang chuyển đến trang thanh toán...");
    navigate("/order/checkout");
  };

  const getDiscountedPrice = (item) => {
    if (!item.discountCode) return item.price;
    const discount = discounts.find((d) => d.code === item.discountCode);
    if (!discount) return item.price;
    return item.price * (1 - discount.discount_percent / 100);
  };

  const totalPrice = cartItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + getDiscountedPrice(item) * item.quantity, 0);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-500 text-lg font-medium mb-4">
            Vui lòng đăng nhập để xem giỏ hàng
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Đi đến trang đăng nhập
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-lg mt-4">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
          {error.includes("đăng nhập lại") && (
            <a
              href="/login"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Đăng nhập lại
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Giỏ hàng</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600">
          <div className="col-span-4 flex items-center">
            <input
              type="checkbox"
              checked={
                cartItems.length > 0 && cartItems.every((item) => item.selected)
              }
              onChange={handleSelectAll}
              className="mr-3 h-4 w-4 text-orange-500 focus:ring-orange-400"
            />
            Sản phẩm
          </div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-2 text-center">Mã giảm giá</div>
          <div className="col-span-1 text-center">Số tiền</div>
          <div className="col-span-1 text-center">Thao tác</div>
        </div>
      </div>

      {cartItems.length > 0 ? (
        cartItems.map(
          ({ id, name, price, quantity, image, selected, discountCode }) => {
            const discountedPrice = getDiscountedPrice({ price, discountCode });
            const totalItemPrice = discountedPrice * quantity;
            const originalTotalPrice = price * quantity;

            return (
              <div
                key={id}
                className="bg-white p-4 rounded-xl shadow-sm mb-4 grid grid-cols-12 gap-4 items-center text-sm"
              >
                <div className="col-span-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleSelectItem(id)}
                    className="mr-3 h-4 w-4 text-orange-500 focus:ring-orange-400"
                  />
                  <img
                    src={image}
                    alt={name}
                    className="w-16 h-16 object-cover rounded-md mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800 truncate">{name}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center text-gray-700">
                  {price.toLocaleString()} ₫
                </div>
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center border border-gray-300 rounded-md w-24 mx-auto">
                    <button
                      onClick={() => handleQuantityChange(id, "decrease")}
                      className="px-3 py-1 text-gray-600 hover:text-orange-500"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-gray-800">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(id, "increase")}
                      className="px-3 py-1 text-gray-600 hover:text-orange-500"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <select
                    value={discountCode}
                    onChange={(e) => handleDiscountChange(id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Không áp dụng</option>
                    {discounts.map((discount) => (
                      <option key={discount.id} value={discount.code}>
                        {discount.code} ({discount.discount_percent}%)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1 text-center text-orange-500 font-semibold">
                  {discountCode ? (
                    <div>
                      <del className="text-gray-500">
                        {originalTotalPrice.toLocaleString()} ₫
                      </del>
                      <div>{totalItemPrice.toLocaleString()} ₫</div>
                    </div>
                  ) : (
                    <div>{originalTotalPrice.toLocaleString()} ₫</div>
                  )}
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => handleDeleteItem(id)}
                    className="text-red-500 hover:text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          }
        )
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống!</p>
          <a
            href="/"
            className="inline-block mt-4 text-orange-500 hover:text-orange-600 font-medium"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={
                  cartItems.length > 0 &&
                  cartItems.every((item) => item.selected)
                }
                onChange={handleSelectAll}
                className="mr-3 h-4 w-4 text-orange-500 focus:ring-orange-400"
              />
              <span className="text-gray-600">
                Chọn tất cả ({cartItems.length})
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-600">Tổng thanh toán: </span>
              <span className="text-orange-500 text-xl font-semibold">
                {totalPrice.toLocaleString()} ₫
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-gray-600"
              >
                Phương thức thanh toán
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="VNPay">VNPay</option>
                <option value="Momo">Momo</option>
                <option value="Paypal">Paypal</option>
                <option value="Stripe">Stripe</option>
                <option value="cod">Thanh toán khi nhận hàng</option>
              </select>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Thanh toán ({cartItems.filter((item) => item.selected).length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
