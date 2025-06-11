import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import {
  IoStarSharp,
  IoStarHalfOutline,
  IoStarOutline,
  IoHeartOutline,
  IoEyeOutline,
  IoRepeatOutline,
  IoBagAddOutline,
  IoHeart,
} from "react-icons/io5";
import Dress from "../../../assets/images/icons/dress.svg";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const token = (localStorage.getItem("token") || "").replace(/^"|"$/g, "");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Handle 401 errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
const Product = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAllProducts, setLoadingAllProducts] = useState(true);
  const [error, setError] = useState(null);
  const [openMenus, setOpenMenus] = useState({});

  const [wishlistStatus, setWishlistStatus] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  const { id: userId } = JSON.parse(localStorage.getItem("user") || "{}");

  const API_URL = "http://127.0.0.1:8000/api/frontend";
  const urlImage = "http://127.0.0.1:8000/images/";
  useEffect(() => {
    if (!userId || !token) {
      toast.warn("Vui lòng đăng nhập để sử dụng đầy đủ tính năng!");
    }
  }, [userId]);
  // Countdown Timer Component
  const CountdownTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    useEffect(() => {
      const calculateTimeLeft = () => {
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();
        const difference = end - now;

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }, [endDate]);

    return (
      <div className="countdown">
        <div className="countdown-content">
          <p className="display-number">{timeLeft.days}</p>
          <p className="display-text">Ngày</p>
        </div>
        <div className="countdown-content">
          <p className="display-number">{timeLeft.hours}</p>
          <p className="display-text">Giờ</p>
        </div>
        <div className="countdown-content">
          <p className="display-number">{timeLeft.minutes}</p>
          <p className="display-text">Phút</p>
        </div>
        <div className="countdown-content">
          <p className="display-number">{timeLeft.seconds}</p>
          <p className="display-text">Giây</p>
        </div>
      </div>
    );
  };
  const handleAddToWishlist = async (productId) => {
    if (!userId || !token) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      navigate("/login");
      return;
    }

    try {
      // Lấy variant ID (mặc định là product_details[0].id)
      const product = allProducts.find((p) => p.id === productId);
      const variantId = product.product_details?.[0]?.id || productId;

      // Kiểm tra trạng thái wishlist hiện tại
      const isCurrentlyWishlisted = wishlistStatus[productId] || false;

      if (isCurrentlyWishlisted) {
        // Xóa khỏi wishlist
        const response = await axios.delete(`${API_URL}/wishlist`, {
          data: { user_id: userId, product_id: variantId },
        });
        if (response.data.status) {
          setWishlistStatus((prev) => ({ ...prev, [productId]: false }));
          toast.success("Đã xóa khỏi danh sách yêu thích!");
        } else {
          toast.error(
            response.data.message || "Không thể xóa khỏi danh sách yêu thích."
          );
        }
      } else {
        // Thêm vào wishlist
        const response = await axios.post(`${API_URL}/wishlist/store`, {
          user_id: userId,
          product_id: variantId,
        });
        if (response.data.status) {
          setWishlistStatus((prev) => ({ ...prev, [productId]: true }));
          toast.success("Đã thêm vào danh sách yêu thích!");
        } else {
          toast.error(
            response.data.message || "Không thể thêm vào danh sách yêu thích."
          );
        }
      }
    } catch (error) {
      console.error("Error handling wishlist:", error);
      toast.error("Lỗi khi xử lý danh sách yêu thích. Vui lòng thử lại.");
    }
  };
  // Hàm chia sẻ sản phẩm lên Facebook
  const handleShareToFacebook = (product) => {
    const productUrl = `http://127.0.0.1:8000/product/${product.id}`;
    const quote = encodeURIComponent(product.name);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productUrl
    )}&quote=${quote}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };
  // Fetch dữ liệu ban đầu (trừ product_all1)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [
          categoriesResponse,
          dealProductsResponse,
          newProductsResponse,
          saleProductsResponse,
          bestsellerProductsResponse,
          topRatedProductsResponse,
        ] = await Promise.all([
          axios.get(`${API_URL}/category/list`),
          axios.get(`${API_URL}/product_deal_of_the_day/2`),
          axios.get(`${API_URL}/product_new/4`),
          axios.get(`${API_URL}/product_sale/4`),
          axios.get(`${API_URL}/product_bestseller/4`),
          axios.get(`${API_URL}/product_top_rated/4`),
        ]);

        setCategories(
          categoriesResponse.data.category_list.map((category) => {
            let categoryImageUrl = null;
            try {
              const parsedImage = category.image
                ? JSON.parse(category.image)
                : [];
              categoryImageUrl =
                Array.isArray(parsedImage) && parsedImage.length > 0
                  ? `${urlImage}category/${parsedImage[0]}`
                  : null;
            } catch (e) {
              console.warn(
                `Invalid image JSON for category ${category.id}:`,
                category.image
              );
            }
            const parsedChildren = (category.children || []).map(
              (subCategory) => {
                let subCategoryImageUrl = null;
                try {
                  const parsedSubImage = subCategory.image
                    ? JSON.parse(subCategory.image)
                    : [];
                  subCategoryImageUrl =
                    Array.isArray(parsedSubImage) && parsedSubImage.length > 0
                      ? `${urlImage}category/${parsedSubImage[0]}`
                      : null;
                } catch (e) {
                  console.warn(
                    `Invalid image JSON for subcategory ${subCategory.id}:`,
                    subCategory.image
                  );
                }
                return {
                  ...subCategory,
                  image_url: subCategoryImageUrl,
                };
              }
            );
            return {
              ...category,
              image_url: categoryImageUrl,
              children: parsedChildren,
            };
          })
        );

        setDealProducts(dealProductsResponse.data.products);
        setNewProducts(newProductsResponse.data.products);
        setSaleProducts(saleProductsResponse.data.products);
        setBestsellerProducts(bestsellerProductsResponse.data.products);
        setTopRatedProducts(topRatedProductsResponse.data.products);

        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        setLoading(false);
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, []);
  // Fetch dữ liệu product_all1 riêng
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoadingAllProducts(true);

        const allProductsResponse = await axios.get(
          `${API_URL}/product_all1?page=${currentPage}&per_page=${perPage}`
        );

        setAllProducts((prev) => [
          ...prev,
          ...allProductsResponse.data.products,
        ]);

        const lastPage = allProductsResponse.data.pagination?.last_page || 1;
        setHasMore(currentPage < lastPage);

        const products = allProductsResponse.data.products;

        if (userId && token) {
          const wishlistChecks = await Promise.all(
            products.map(async (product) => {
              const variantId = product.product_details?.[0]?.id || product.id;
              try {
                const response = await axios.get(
                  `${API_URL}/wishlist/check/${variantId}`
                );
                return {
                  productId: product.id,
                  isWishlisted: response.data.isWishlisted,
                };
              } catch (err) {
                console.error(
                  `Error checking wishlist for product ${product.id}:`,
                  err
                );
                return { productId: product.id, isWishlisted: false };
              }
            })
          );
          const wishlistStatusMap = wishlistChecks.reduce(
            (acc, { productId, isWishlisted }) => {
              acc[productId] = isWishlisted;
              return acc;
            },
            {}
          );
          setWishlistStatus((prev) => ({ ...prev, ...wishlistStatusMap }));
        }

        setLoadingAllProducts(false);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
        setLoadingAllProducts(false);
        console.error("Error fetching all products:", err);
      }
    };

    if (!loading) {
      fetchAllProducts();
    }
  }, [currentPage, loading, userId, token]);

  const toggleMenu = (categoryId) => {
    setOpenMenus((prev) => {
      const newOpenMenus = {
        ...prev,
        [categoryId]: !prev[categoryId],
      };

      return newOpenMenus;
    });
  };
  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const calculateSalePrice = (minPrice, discountPercent) => {
    // Convert minPrice to a number, fallback to 100 if invalid
    const price = isNaN(parseFloat(minPrice)) ? 100 : parseFloat(minPrice);
    if (!discountPercent) {
      return { salePrice: price.toFixed(2), comparePrice: null };
    }
    const salePrice = price * (1 - discountPercent / 100);
    return { salePrice: salePrice.toFixed(2), comparePrice: price.toFixed(2) };
  };

  const renderStars = (rating) => {
    const stars = [];
    const effectiveRating = rating || 0; // Fallback to 0 if rating is null/undefined
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(effectiveRating)) {
        stars.push(<IoStarSharp key={i} />);
      } else if (
        i === Math.ceil(effectiveRating) &&
        effectiveRating % 1 !== 0
      ) {
        stars.push(<IoStarHalfOutline key={i} />);
      } else {
        stars.push(<IoStarOutline key={i} />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-5 min-h-screen">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="w-full md:w-1/4">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </motion.div>
          </div>
          {/* Main Content Skeleton */}
          <div className="w-full md:w-3/4">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {/* Showcase Sections */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="h-6 w-48 bg-gray-300 rounded"></div>
                  <div className="flex gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-16 w-16 bg-gray-300 rounded"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-gray-300 rounded"></div>
                          <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* Product Grid */}
              <div className="space-y-4">
                <div className="h-6 w-48 bg-gray-300 rounded"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-48 w-full bg-gray-300 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-5 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-container">
      <style>
        {`
            /* Định nghĩa các biến CSS mặc định nếu chưa có */
            :root {
              --sonic-silver: #737373; /* Màu xám mặc định */
              --eerie-black: #1a1a1a; /* Màu đen mặc định khi hover */
              --davys-gray: #555555; /* Màu xám đậm khi hover submenu-title */
              --fs-7: 14px; /* Kích thước chữ mặc định */
              --fs-6: 16px; /* Kích thước chữ lớn hơn cho submenu-title */
              --weight-300: 300; /* Font weight nhẹ */
            }

            .showcase-banner {
              position: relative;
              overflow: hidden;
            }
            .product-img.default {
              display: block;
              transition: opacity 0.3s ease;
            }
            .product-img.hover {
              position: absolute;
              top: 0;
              left: 0;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .showcase-banner:hover .product-img.default {
              opacity: 0;
            }
            .showcase-banner:hover .product-img.hover {
              opacity: 1;
            }
            .load-more-btn {
              display: block;
              margin: 20px auto;
              padding: 10px 20px;
              background-color: #007bff;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              transition: background-color 0.3s ease;
            }
            .load-more-btn:hover {
              background-color: #0056b3;
            }
            .submenu-title-flex {
              display: flex;
              align-items: center;
              gap: 8px;
              color: var(--sonic-silver);
              opacity: 1 !important;
            }
        
            /* Áp dụng CSS gốc của .sidebar-submenu-title */
            .sidebar-submenu-title {
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-pack: justify;
              -webkit-justify-content: space-between;
                  -ms-flex-pack: justify;
                      justify-content: space-between;
              -webkit-box-align: center;
              -webkit-align-items: center;
                  -ms-flex-align: center;
                      align-items: center;
              color: var(--sonic-silver);
              font-size: var(--fs-7);
              padding: 5px 0; /* Tăng padding */
              opacity: 1 !important; /* Đảm bảo không bị ẩn */
            }
            .sidebar-submenu-title:hover {
              color: var(--eerie-black);
            }
            .submenu-title-text {
              padding: 6px 0;
              font-size: var(--fs-6);
              color: var(--sonic-silver);
              font-weight: var(--weight-300);
              opacity: 1 !important;
            }
            .submenu-title-text:hover {
              color: var(--davys-gray);
            }
            .stock {
              color: #666 !important;
              font-size: 12px;
              opacity: 1 !important;
            }
          `}
      </style>
      <div className="container">
        <div className="sidebar has-scrollbar " data-mobile-menu>
          <div className="sidebar-category">
            <div className="sidebar-top">
              <h2 className="sidebar-title">Danh mục</h2>
              <button
                className="sidebar-close-btn"
                data-mobile-menu-close-btn
              ></button>
            </div>
            <ul className="sidebar-menu-category-list">
              {categories.map((category) => (
                <li className="sidebar-menu-category" key={category.id}>
                  <button
                    className="sidebar-accordion-menu"
                    onClick={() => {
                      if (category.children && category.children.length > 0) {
                        toggleMenu(category.id);
                      }
                    }}
                    data-accordion-btn
                  >
                    <div className="menu-title-flex">
                      <img
                        src={category.image_url || Dress}
                        alt={category.name}
                        width="20"
                        height="20"
                        className="menu-title-img"
                      />
                      <p className="menu-title">{category.name}</p>
                    </div>
                    {category.children && category.children.length > 0 && (
                      <div>
                        <FontAwesomeIcon
                          icon={openMenus[category.id] ? faMinus : faPlus}
                          className="md hydrated"
                        />
                      </div>
                    )}
                  </button>
                  {category.children && category.children.length > 0 ? (
                    <ul
                      className={`sidebar-submenu-category-list ${
                        openMenus[category.id] ? "active" : ""
                      }`}
                      data-accordion
                    >
                      {category.children.map((subCategory) => (
                        <li
                          className="sidebar-submenu-category"
                          key={subCategory.id}
                        >
                          <Link
                            to={`/product/all?category_id=${subCategory.id}`}
                            className="sidebar-submenu-title"
                          >
                            <div className="submenu-title-flex">
                              <img
                                src={subCategory.image_url || Dress}
                                alt={subCategory.name || "Danh mục con"}
                                width="16"
                                height="16"
                                className="menu-title-img"
                              />
                              <p className="submenu-title-text">
                                {subCategory.name || "Không tên"}
                              </p>
                            </div>
                            <data
                              value={subCategory.product_count || 0}
                              className="stock"
                              title="Số lượng sản phẩm"
                            >
                              {subCategory.product_count || 0}
                            </data>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="product-showcase">
            <h3 className="showcase-heading">Bán chạy</h3>
            <div className="showcase-wrapper">
              <div className="showcase-container">
                {bestsellerProducts.map((product) => {
                  const { salePrice, comparePrice } = calculateSalePrice(
                    product.min_price,
                    product.discount_percent
                  );
                  const images = product.images || [];
                  return (
                    <div className="showcase" key={product.id}>
                      <Link
                        to={`/product/${product.id}`}
                        className="showcase-img-box"
                      >
                        <img
                          src={
                            images[0]?.image_url
                              ? `${urlImage}product/${images[0].image_url}`
                              : require("../../../assets/images/products/1.jpg")
                          }
                          alt={product.name}
                          width="75"
                          height="75"
                          className="showcase-img"
                        />
                      </Link>
                      <div className="showcase-content">
                        <Link to={`/product/${product.id}`}>
                          <h4 className="showcase-title">{product.name}</h4>
                        </Link>
                        <div className="showcase-rating">
                          {renderStars(product.average_rating || 4.5)}
                        </div>
                        <div className="price-box">
                          {comparePrice && <del>{comparePrice}₫</del>}
                          <p className="price">{salePrice}₫</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="product-box">
          <div className="product-minimal">
            <div className="product-showcase">
              <h2 className="title">Hàng mới về</h2>
              <div className="showcase-wrapper has-scrollbar">
                <div className="showcase-container">
                  {newProducts.map((product) => {
                    const { salePrice, comparePrice } = calculateSalePrice(
                      product.min_price,
                      product.discount_percent
                    );
                    const images = product.images || [];
                    return (
                      <div className="showcase" key={product.id}>
                        <Link
                          to={`/product/${product.id}`}
                          className="showcase-img-box"
                        >
                          <img
                            src={
                              images[0]?.image_url
                                ? `${urlImage}product/${images[0].image_url}`
                                : require("../../../assets/images/products/clothes-1.jpg")
                            }
                            alt={product.name}
                            width="70"
                            className="showcase-img"
                          />
                        </Link>
                        <div className="showcase-content">
                          <Link to={`/product/${product.id}`}>
                            <h4 className="showcase-title">{product.name}</h4>
                          </Link>
                          <Link
                            to={`/product/all?category_id=${product.categories[0]?.id}`}
                            className="showcase-category"
                          >
                            {product.categories[0]?.name || "Không xác định"}
                          </Link>
                          <div className="price-box">
                            <p className="price">{salePrice}₫</p>
                            {comparePrice && <del>{comparePrice}₫</del>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="product-showcase">
              <h2 className="title">Khuyến mãi</h2>
              <div className="showcase-wrapper has-scrollbar">
                <div className="showcase-container">
                  {saleProducts.map((product) => {
                    const { salePrice, comparePrice } = calculateSalePrice(
                      product.min_price,
                      product.discount_percent
                    );
                    const images = product.images || [];
                    return (
                      <div className="showcase" key={product.id}>
                        <Link
                          to={`/product/${product.id}`}
                          className="showcase-img-box"
                        >
                          <img
                            src={
                              images[0]?.image_url
                                ? `${urlImage}product/${images[0].image_url}`
                                : require("../../../assets/images/products/sports-1.jpg")
                            }
                            alt={product.name}
                            width="70"
                            className="showcase-img"
                          />
                        </Link>
                        <div className="showcase-content">
                          <Link to={`/product/${product.id}`}>
                            <h4 className="showcase-title">{product.name}</h4>
                          </Link>
                          <Link
                            to={`/product/all?category_id=${product.categories[0]?.id}`}
                            className="showcase-category"
                          >
                            {product.categories[0]?.name || "Không xác định"}
                          </Link>
                          <div className="price-box">
                            <p className="price">{salePrice}₫</p>
                            {comparePrice && <del>{comparePrice}₫</del>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="product-showcase">
              <h2 className="title">Đánh giá cao</h2>
              <div className="showcase-wrapper has-scrollbar">
                <div className="showcase-container">
                  {topRatedProducts.map((product) => {
                    const { salePrice, comparePrice } = calculateSalePrice(
                      product.min_price,
                      product.discount_percent
                    );
                    const images = product.images || [];
                    return (
                      <div className="showcase" key={product.id}>
                        <Link
                          to={`/product/${product.id}`}
                          className="showcase-img-box"
                        >
                          <img
                            src={
                              images[0]?.image_url
                                ? `${urlImage}product/${images[0].image_url}`
                                : require("../../../assets/images/products/watch-3.jpg")
                            }
                            alt={product.name}
                            className="showcase-img"
                            width="70"
                          />
                        </Link>
                        <div className="showcase-content">
                          <Link to={`/product/${product.id}`}>
                            <h4 className="showcase-title">{product.name}</h4>
                          </Link>
                          <Link
                            to={`/product/all?category_id=${product.categories[0]?.id}`}
                            className="showcase-category"
                          >
                            {product.categories[0]?.name || "Không xác định"}
                          </Link>
                          <div className="showcase-rating">
                            {renderStars(product.average_rating)}
                          </div>
                          <div className="price-box">
                            <p className="price">{salePrice}₫</p>
                            {comparePrice && <del>{comparePrice}₫</del>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="product-featured">
            <h2 className="title">Ưu đãi trong ngày</h2>
            <div className="showcase-wrapper has-scrollbar">
              {dealProducts.map((product) => {
                const { salePrice, comparePrice } = calculateSalePrice(
                  product.min_price,
                  product.discount_percent
                );
                const images = product.images || [];
                return (
                  <div className="showcase-container" key={product.id}>
                    <div className="showcase">
                      <div className="showcase-banner">
                        <img
                          src={
                            images[0]?.image_url
                              ? `${urlImage}product/${images[0].image_url}`
                              : require("../../../assets/images/products/shampoo.jpg")
                          }
                          alt={product.name}
                          className="showcase-img"
                        />
                      </div>
                      <div className="showcase-content">
                        <div className="showcase-rating">
                          {renderStars(product.average_rating || 4)}
                        </div>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="showcase-title">{product.name}</h3>
                        </Link>
                        <p className="showcase-desc">
                          {product.description ||
                            "Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                        </p>
                        <div className="price-box">
                          <p className="price">{salePrice}₫</p>
                          {comparePrice && <del>{comparePrice}₫</del>}
                        </div>
                        <Link to={`/product/${product.id}`}>
                          <button className="add-cart-btn">Thêm vào giỏ</button>
                        </Link>
                        <div className="showcase-status">
                          <div className="wrapper">
                            <p>
                              Đã bán: <b>{product.stock_sold || 20}</b>
                            </p>
                            <p>
                              Còn lại: <b>{product.stock_available || 40}</b>
                            </p>
                          </div>
                          <div className="showcase-status-bar"></div>
                        </div>
                        <div className="countdown-box">
                          <p className="countdown-desc">
                            Nhanh lên! Ưu đãi kết thúc sau:
                          </p>
                          {product.end_date ? (
                            <CountdownTimer endDate={product.end_date} />
                          ) : (
                            <div className="countdown">
                              <div className="countdown-content">
                                <p className="display-number">0</p>
                                <p className="display-text">Ngày</p>
                              </div>
                              <div className="countdown-content">
                                <p className="display-number">0</p>
                                <p className="display-text">Giờ</p>
                              </div>
                              <div className="countdown-content">
                                <p className="display-number">0</p>
                                <p className="display-text">Phút</p>
                              </div>
                              <div className="countdown-content">
                                <p className="display-number">0</p>
                                <p className="display-text">Giây</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="product-main">
            <h2 className="title">Sản phẩm mới</h2>
            <div className="product-grid">
              {allProducts.map((product) => {
                const { salePrice, comparePrice } = calculateSalePrice(
                  product.min_price,
                  product.discount_percent
                );
                const images = product.images || [];
                const defaultImage = images[0]?.image_url
                  ? `${urlImage}product/${images[0].image_url}`
                  : require("../../../assets/images/products/shirt-1.jpg");
                const hoverImage =
                  images.length > 1 && images[1]?.image_url
                    ? `${urlImage}product/${images[1].image_url}`
                    : defaultImage;
                return (
                  <div className="showcase" key={product.id}>
                    <div className="showcase-banner">
                      <img
                        src={defaultImage}
                        alt={product.name}
                        className="product-img default"
                        width="300"
                        loading="lazy"
                      />
                      <img
                        src={hoverImage}
                        alt={product.name}
                        className="product-img hover"
                        width="300"
                        loading="lazy"
                      />
                      {product.discount_percent && (
                        <p className="showcase-badge angle black">giảm giá</p>
                      )}
                      <div className="showcase-actions">
                        <button
                          className="btn-action"
                          title={
                            wishlistStatus[product.id]
                              ? "Bỏ yêu thích"
                              : "Yêu thích"
                          }
                          onClick={() => handleAddToWishlist(product.id)}
                        >
                          {wishlistStatus[product.id] ? (
                            <IoHeart />
                          ) : (
                            <IoHeartOutline />
                          )}
                        </button>
                        <Link
                          to={`/product/${product.id}`}
                          className="btn-action"
                          title="Xem chi tiết"
                        >
                          <IoEyeOutline />
                        </Link>
                        {/* Nút chia sẻ Facebook */}
                        <button
                          className="btn-action"
                          title="Chia sẻ lên Facebook"
                          onClick={() => handleShareToFacebook(product)}
                        >
                          <FontAwesomeIcon icon={faFacebookF} />
                        </button>
                      </div>
                    </div>
                    <div className="showcase-content">
                      <h3>
                        <Link
                          to={`/product/${product.id}`}
                          className="showcase-title"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <div className="showcase-rating">
                        {renderStars(product.average_rating || 5)}
                      </div>
                      <div className="price-box">
                        <p className="price">{salePrice}₫</p>
                        {comparePrice && <del>{comparePrice}₫</del>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {hasMore && (
              <button className="load-more-btn" onClick={handleLoadMore}>
                Xem thêm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
