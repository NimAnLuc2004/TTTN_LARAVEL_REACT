import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = "http://127.0.0.1:8000/api/frontend";
  const urlImage = "http://127.0.0.1:8000/images/product/";

  const { id: userId } = JSON.parse(localStorage.getItem("user") || "{}");
  const token = (localStorage.getItem("token") || "").replace(/^"|"$/g, "");
  const isAuthenticated = !!userId && !!token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productResponse = await axios.get(
          `${API_URL}/product_detail/${id}/4`
        );
        if (!productResponse.data.status) {
          throw new Error(productResponse.data.message);
        }
        setProductData(productResponse.data);

        const reviewResponse = await axios.get(
          `${API_URL}/reviews/product/${id}`
        );
        setReviews(reviewResponse.data.data);

        if (productResponse.data.product_details.length > 0) {
          setSelectedVariant(productResponse.data.product_details[0]);
        }
        if (isAuthenticated) {
          try {
            const wishlistResponse = await axios.get(
              `${API_URL}/wishlist/check/${id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setIsWishlisted(wishlistResponse.data.isWishlisted || false);
          } catch (err) {
            console.error("Error checking wishlist status:", err);
          }
        }

        if (productResponse.data.product.images.length > 0) {
          setMainImage(
            `${urlImage}${productResponse.data.product.images[0].image_url}`
          );
        } else {
          setMainImage("https://via.placeholder.com/300x300?text=Product");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || "Không thể tải dữ liệu sản phẩm.");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      navigate("/login");
      return;
    }
    if (!selectedVariant) {
      toast.error("Vui lòng chọn sản phẩm!");
      return;
    }

    if (isWishlisted) {
      // Remove from wishlist
      await handleRemoveItem(id);
    } else {
      // Add to wishlist
      try {
        const response = await axios.post(
          `${API_URL}/wishlist/store`,
          {
            user_id: userId,
            product_id: id, // Use variant ID
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status) {
          setIsWishlisted(true);
          toast.success("Đã thêm vào danh sách yêu thích!");
          window.location.reload();
          window.dispatchEvent(new Event("wishlistUpdated"));
        } else {
          toast.error(
            response.data.message || "Không thể thêm vào danh sách yêu thích."
          );
        }
      } catch (err) {
        console.error("Error adding to wishlist:", err);
        toast.error("Lỗi khi thêm vào danh sách yêu thích. Vui lòng thử lại.");
      }
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { user_id: userId, product_id: id },
      });

      if (response.data.status) {
        setIsWishlisted(false);
        toast.success("Đã xóa khỏi danh sách yêu thích!");
        window.location.reload();
        window.dispatchEvent(new Event("wishlistUpdated"));
      } else {
        toast.error(
          response.data.message ||
            "Không thể xóa sản phẩm khỏi danh sách yêu thích."
        );
      }
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Lỗi khi xóa sản phẩm. Vui lòng thử lại.");
    }
  };

  const handleQuantityChange = (action) => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn sản phẩm!");
      return;
    }

    if (action === "increase") {
      if (quantity >= selectedVariant.stock_qty) {
        toast.error(
          `Hết sản phẩm! Chỉ còn ${selectedVariant.stock_qty} sản phẩm trong kho.`
        );
        return;
      }
      setQuantity(quantity + 1);
      if (quantity + 1 === selectedVariant.stock_qty) {
        toast.warn(`Chỉ còn ${selectedVariant.stock_qty} sản phẩm trong kho!`);
      }
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleVariantChange = (variant) => {
    if (!variant) {
      toast.error("Sản phẩm này đã hết hàng!");
      setSelectedVariant(null);
      setQuantity(1);
      return;
    }
    setSelectedVariant(variant);
    setQuantity(1);
    if (variant.stock_qty <= 0) {
      toast.error("Sản phẩm này đã hết hàng!");
    } else if (variant.stock_qty <= 5) {
      toast.warn(`Chỉ còn ${variant.stock_qty} sản phẩm cho biến thể này!`);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      navigate("/login");
      return;
    }
    if (!selectedVariant) {
      toast.error("Vui lòng chọn sản phẩm.");
      return;
    }
    if (quantity > selectedVariant.stock_qty) {
      toast.error(
        `Hết sản phẩm! Chỉ còn ${selectedVariant.stock_qty} sản phẩm trong kho.`
      );
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/cart/store`,
        {
          user_id: userId,
          product_id: selectedVariant.id,
          quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        toast.success("Thêm vào giỏ hàng thành công!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.data.message || "Không thể thêm vào giỏ hàng.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thể thêm vào giỏ hàng."
      );
      console.error("Error adding to cart:", err);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua hàng.");
      navigate("/login");
      return;
    }
    if (!selectedVariant) {
      toast.error("Vui lòng chọn sản phẩm.");
      return;
    }
    if (quantity > selectedVariant.stock_qty) {
      toast.error(
        `Hết sản phẩm! Chỉ còn ${selectedVariant.stock_qty} sản phẩm trong kho.`
      );
      return;
    }

    try {
      const cartResponse = await axios.post(
        `${API_URL}/cart/store`,
        {
          user_id: userId,
          product_id: selectedVariant.id,
          quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!cartResponse.data.status) {
        toast.error(
          cartResponse.data.message || "Không thể thêm vào giỏ hàng."
        );
        return;
      }

      const checkoutOrder = {
        selectedItems: [
          {
            id: selectedVariant.id,
            product_id: selectedVariant.id,
            name: selectedVariant.name || productData.product.name,
            price: selectedVariant.price,
            quantity,
            image: productData.product.images[0]?.image_url
              ? `${urlImage}${productData.product.images[0].image_url}`
              : "https://via.placeholder.com/80x80?text=Product",
          },
        ],
        totalPrice:
          selectedVariant.price *
          quantity *
          (1 - (selectedVariant.discount_percent || 0) / 100),
        order: {
          id: null,
          total_amount:
            selectedVariant.price *
            quantity *
            (1 - (selectedVariant.discount_percent || 0) / 100),
        },
        payment: {
          payment_method: "VNPay",
        },
      };

      localStorage.setItem("checkoutOrder", JSON.stringify(checkoutOrder));
      navigate("/order/checkout");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xử lý đơn hàng.");
      console.error("Error preparing order:", err);
    }
  };

  const handleStarClick = (star) => {
    setRating(star);
    setReviewError(null);
  };

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để gửi đánh giá.");
      navigate("/login");
      return;
    }
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/reviews/store`,
        {
          user_id: userId,
          product_id: id,
          rating,
          comment: comment || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        const reviewResponse = await axios.get(
          `${API_URL}/reviews/product/${id}`
        );
        setReviews(reviewResponse.data.data);
        setRating(0);
        setComment("");
        setReviewError(null);
        toast.success("Gửi đánh giá thành công!");
      } else {
        toast.error(response.data.message || "Không thể gửi đánh giá.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể gửi đánh giá.");
      console.error("Error submitting review:", err);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-lg mt-4">
            Đang tải chi tiết sản phẩm...
          </p>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-500 text-lg font-medium mb-4">
            {error || "Sản phẩm không tồn tại."}
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const { product, product_details, related_products, categories } =
    productData;

  const discountedPrice = selectedVariant
    ? selectedVariant.price *
      (1 - (selectedVariant.discount_percent || 0) / 100)
    : product.min_price * (1 - (product.discount_percent || 0) / 100);

  return (
    <div className="container mx-auto p-5">
      <div className="flex flex-row items-center gap-2 text-sm text-gray-500 mb-3 flex-nowrap">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to={`/product/all?category_id=${categories[0]?.id}`}>
          {categories[0]?.name || "Danh mục"}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="md:w-1/2">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="flex gap-2 mt-3 flex-wrap">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={`${urlImage}${img.image_url}`}
                alt={`Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer hover:border-2 hover:border-orange-500 ${
                  mainImage === `${urlImage}${img.image_url}`
                    ? "border-2 border-orange-500"
                    : ""
                }`}
                onClick={() => handleImageClick(`${urlImage}${img.image_url}`)}
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-2xl font-semibold mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl text-orange-500 font-bold">
              {discountedPrice.toLocaleString()} ₫
            </span>
            <span className="text-xl text-gray-500 line-through">
              {(selectedVariant
                ? selectedVariant.price
                : product.min_price
              ).toLocaleString()}{" "}
              ₫
            </span>
            {product.discount_percent && (
              <span className="bg-orange-100 text-orange-500 px-2 py-1 rounded-md">
                -{product.discount_percent}%
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 mb-3">
            Đã bán: {product.sold_qty || 0} | Tồn kho:{" "}
            {selectedVariant?.stock_qty || product.qty}
          </div>

          {product_details.length > 0 && (
            <>
              <div className="mb-3">
                <p className="font-medium">Màu sắc</p>
                <div className="flex gap-2">
                  {[...new Set(product_details.map((v) => v.color))].map(
                    (color, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleVariantChange(
                            product_details.find((v) => v.color === color)
                          )
                        }
                        className={`border border-gray-300 px-3 py-1 rounded-md hover:border-orange-500 hover:text-orange-500 ${
                          selectedVariant?.color === color
                            ? "border-orange-500 text-orange-500"
                            : ""
                        }`}
                      >
                        {color}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="mb-3">
                <p className="font-medium">Kích cỡ</p>
                <div className="flex gap-2">
                  {[...new Set(product_details.map((v) => v.size))].map(
                    (size, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleVariantChange(
                            product_details.find(
                              (v) =>
                                v.size === size &&
                                v.color === selectedVariant?.color
                            )
                          )
                        }
                        className={`border border-gray-300 px-3 py-1 rounded-md hover:border-orange-500 hover:text-orange-500 ${
                          selectedVariant?.size === size
                            ? "border-orange-500 text-orange-500"
                            : ""
                        }`}
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-3 mb-3">
            <p className="font-medium">Số lượng</p>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="px-3 py-1"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-1">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("increase")}
                className="px-3 py-1"
                disabled={
                  quantity >= (selectedVariant?.stock_qty || product.qty)
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 text-white px-5 py-3 rounded-md hover:bg-orange-600 transition"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-orange-600 text-white px-5 py-3 rounded-md hover:bg-orange-700 transition"
            >
              Mua ngay
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`px-5 py-3 rounded-md transition flex items-center gap-2 ${
                isWishlisted
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-100 text-orange-500 hover:bg-gray-200"
              }`}
            >
              <FontAwesomeIcon
                icon={isWishlisted ? faSolidHeart : faRegularHeart}
                className={isWishlisted ? "text-white" : "text-orange-500"}
              />
              {isWishlisted ? "Bỏ yêu thích" : "Yêu thích"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white p-5 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Chi tiết sản phẩm</h2>
        <div className="text-sm text-gray-700">
          <p className="mb-2">
            Thương hiệu: {product.brand?.name || "Không xác định"}
          </p>
          <p className="mb-2">Xuất xứ: Việt Nam</p>
          <p className="mb-2">
            Dung tích: {product_details.map((v) => v.size).join(" / ")}
          </p>
          <ul className="list-disc pl-5">
            {product.description ? (
              product.description.split(". ").map(
                (detail, index) =>
                  detail && (
                    <li key={index} className="mb-1">
                      {detail}
                    </li>
                  )
              )
            ) : (
              <li>Không có mô tả chi tiết.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-10 bg-white p-5 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Đánh giá sản phẩm</h2>
        {isAuthenticated ? (
          <div className="mb-5 border-b border-gray-200 pb-5">
            <p className="font-medium mb-2">Gửi đánh giá của bạn</p>
            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-6 h-6 cursor-pointer ${
                    index < rating ? "text-orange-500" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  onClick={() => handleStarClick(index + 1)}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {reviewError && (
              <p className="text-red-500 text-sm mb-3">{reviewError}</p>
            )}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Viết đánh giá của bạn..."
              className="w-full p-3 border border-gray-300 rounded-md mb-3"
              rows="4"
            />
            <button
              onClick={handleSubmitReview}
              className="bg-orange-500 text-white px-5 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Gửi đánh giá
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mb-5">
            Vui lòng{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              đăng nhập
            </Link>{" "}
            để gửi đánh giá.
          </p>
        )}

        {reviews.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="text-2xl text-orange-500 font-bold">
                {averageRating}/5
              </div>
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.round(averageRating)
                        ? "text-orange-500"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500">({reviews.length} đánh giá)</span>
            </div>
            <div className="space-y-5">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{review.user}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, starIndex) => (
                        <svg
                          key={starIndex}
                          className={`w-4 h-4 ${
                            starIndex < review.rating
                              ? "text-orange-500"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{review.date}</p>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        )}
      </div>

      <div className="mt-10 mb-10">
        <h2 className="text-xl font-semibold mb-3">Sản phẩm gợi ý</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {related_products.map((item, index) => (
            <Link
              to={`/product/${item.id}`}
              key={index}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
            >
              <img
                src={
                  item.images[0]?.image_url
                    ? `${urlImage}${item.images[0].image_url}`
                    : "https://via.placeholder.com/150x150?text=Product"
                }
                alt={item.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-orange-500 font-semibold">
                {(
                  item.min_price *
                  (1 - (item.discount_percent || 0) / 100)
                ).toLocaleString()}{" "}
                ₫
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
