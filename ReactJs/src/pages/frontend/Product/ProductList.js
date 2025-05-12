import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { IoStarSharp, IoStarHalfOutline, IoStarOutline, IoHeartOutline, IoHeart, IoEyeOutline } from "react-icons/io5";

const API_URL = "http://127.0.0.1:8000/api/frontend";
const urlImage = "http://127.0.0.1:8000/images/";

const token = (localStorage.getItem("token") || "").replace(/^"|"$/g, "");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

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

const ProductList = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL (/brand/:id)
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  });
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const { id: userId } = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!userId || !token) {
      toast.warn("Vui lòng đăng nhập để sử dụng đầy đủ tính năng!");
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy danh sách tất cả brand
        const brandsResponse = await axios.get(`${API_URL}/get_all_brands`);
        if (brandsResponse.data.status) {
          setBrands(brandsResponse.data.data.brands);
        } else {
          setError(brandsResponse.data.message || "Không thể tải danh sách thương hiệu");
          toast.error(brandsResponse.data.message || "Không thể tải danh sách thương hiệu");
          setLoading(false);
          return;
        }

        // Lấy tất cả sản phẩm
        const productsResponse = await axios.get(`${API_URL}/product_all`);
        if (productsResponse.data.status) {
          const allProducts = productsResponse.data.products;
          setAllProducts(allProducts);

          // Lấy brand_id từ URL params
          const parsedBrandId = id ? parseInt(id, 10) : null;
          setSelectedBrand(parsedBrandId);

          if (parsedBrandId) {
            // Lọc sản phẩm dựa trên brand_id
            const filteredProducts = allProducts.filter(
              (product) => product.brand_id === parsedBrandId
            );
            setProducts(filteredProducts.slice(0, pagination.per_page));
            setPagination({
              current_page: 1,
              per_page: pagination.per_page,
              total: filteredProducts.length,
              last_page: Math.ceil(filteredProducts.length / pagination.per_page),
            });
          } else {
            // Hiển thị tất cả sản phẩm
            setProducts(allProducts.slice(0, pagination.per_page));
            setPagination({
              current_page: 1,
              per_page: pagination.per_page,
              total: allProducts.length,
              last_page: Math.ceil(allProducts.length / pagination.per_page),
            });
          }

          // Kiểm tra wishlist
          if (userId && token) {
            const wishlistChecks = await Promise.all(
              allProducts.map(async (product) => {
                const variantId = product.product_details?.[0]?.id || product.id;
                try {
                  const response = await axios.get(`${API_URL}/wishlist/check/${variantId}`);
                  return { productId: product.id, isWishlisted: response.data.isWishlisted };
                } catch (err) {
                  console.error(`Lỗi khi kiểm tra wishlist cho sản phẩm ${product.id}:`, err);
                  return { productId: product.id, isWishlisted: false };
                }
              })
            );
            const wishlistStatusMap = wishlistChecks.reduce((acc, { productId, isWishlisted }) => {
              acc[productId] = isWishlisted;
              return acc;
            }, {});
            setWishlistStatus(wishlistStatusMap);
          }
        } else {
          setError(productsResponse.data.message || "Không thể tải dữ liệu sản phẩm");
          toast.error(productsResponse.data.message || "Không thể tải dữ liệu sản phẩm");
        }

        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        setLoading(false);
        console.error("Lỗi khi lấy dữ liệu:", err);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
      }
    };

    fetchData();
  }, [id]); // Phụ thuộc vào id từ URL

  useEffect(() => {
    // Cập nhật sản phẩm hiển thị khi per_page thay đổi
    if (selectedBrand) {
      const filteredProducts = allProducts.filter(
        (product) => product.brand_id === selectedBrand
      );
      setProducts(filteredProducts.slice(0, pagination.per_page));
      setPagination((prev) => ({
        ...prev,
        total: filteredProducts.length,
        last_page: Math.ceil(filteredProducts.length / prev.per_page),
      }));
    } else {
      setProducts(allProducts.slice(0, pagination.per_page));
      setPagination((prev) => ({
        ...prev,
        total: allProducts.length,
        last_page: Math.ceil(allProducts.length / prev.per_page),
      }));
    }
  }, [pagination.per_page, allProducts, selectedBrand]);

  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId);
    if (brandId) {
      // Navigate đến /brand/:id
      navigate(`/brand/${brandId}`);
    } else {
      // Navigate đến /brand (hoặc /products nếu bạn muốn route khác)
      navigate("/brand");
    }
    setError(null);
  };

  const handleLoadMore = () => {
    setPagination((prev) => ({
      ...prev,
      per_page: prev.per_page + 12,
      current_page: 1,
    }));
  };

  const handleAddToWishlist = async (productId) => {
    if (!userId || !token) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      navigate("/login");
      return;
    }

    try {
      const product = products.find((p) => p.id === productId);
      const variantId = product.product_details?.[0]?.id || productId;
      const isCurrentlyWishlisted = wishlistStatus[productId] || false;

      if (isCurrentlyWishlisted) {
        const response = await axios.delete(`${API_URL}/wishlist`, {
          data: { user_id: userId, product_id: variantId },
        });
        if (response.data.status) {
          setWishlistStatus((prev) => ({ ...prev, [productId]: false }));
          toast.success("Đã xóa khỏi danh sách yêu thích!");
        } else {
          toast.error(response.data.message || "Không thể xóa khỏi danh sách yêu thích.");
        }
      } else {
        const response = await axios.post(`${API_URL}/wishlist/store`, {
          user_id: userId,
          product_id: variantId,
        });
        if (response.data.status) {
          setWishlistStatus((prev) => ({ ...prev, [productId]: true }));
          toast.success("Đã thêm vào danh sách yêu thích!");
        } else {
          toast.error(response.data.message || "Không thể thêm vào danh sách yêu thích.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý wishlist:", error);
      toast.error("Lỗi khi xử lý danh sách yêu thích. Vui lòng thử lại.");
    }
  };

  const calculateSalePrice = (minPrice, discountPercent) => {
    const price = isNaN(parseFloat(minPrice)) ? 100 : parseFloat(minPrice);
    if (!discountPercent) {
      return { salePrice: price.toFixed(2), comparePrice: null };
    }
    const salePrice = price * (1 - discountPercent / 100);
    return { salePrice: salePrice.toFixed(2), comparePrice: price.toFixed(2) };
  };

  const renderStars = (rating) => {
    const stars = [];
    const effectiveRating = rating || 0;
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(effectiveRating)) {
        stars.push(<IoStarSharp key={i} className="text-yellow-400" />);
      } else if (i === Math.ceil(effectiveRating) && effectiveRating % 1 !== 0) {
        stars.push(<IoStarHalfOutline key={i} className="text-yellow-400" />);
      } else {
        stars.push(<IoStarOutline key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

if (loading) {
    return (
      <div className="container mx-auto p-4">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-48 w-full bg-gray-200 rounded mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, starIndex) => (
                  <div key={starIndex} className="h-4 w-4 bg-gray-200 rounded-full"></div>
                ))}
              </div>
              <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </motion.div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
  
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar lọc thương hiệu */}
          <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thương Hiệu</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleBrandSelect(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedBrand === null
                      ? "bg-red-600 text-white border-2 border-red-700 shadow-md"
                      : "text-gray-700 hover:bg-red-100 hover:text-red-600"
                  }`}
                >
                  Tất cả thương hiệu
                </button>
              </li>
              {brands.map((brand) => (
                <li key={brand.id}>
                  <button
                    onClick={() => handleBrandSelect(brand.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedBrand === brand.id
                        ? "bg-red-600 text-white border-2 border-red-700 shadow-md"
                        : "text-gray-700 hover:bg-red-100 hover:text-red-600"
                    }`}
                  >
                    {brand.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tất cả sản phẩm</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-200" : "bg-white"} border hover:bg-gray-300 transition`}
                  title="Chế độ lưới"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-gray-200" : "bg-white"} border hover:bg-gray-300 transition`}
                  title="Chế độ danh sách"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 4h4M4 16v4m0-4h4m8-8v16m-4-16v16" />
                  </svg>
                </button>
              </div>
            </div>

            <motion.div
              className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              layout
            >
              <AnimatePresence>
                {products.map((product) => {
                  const { salePrice, comparePrice } = calculateSalePrice(product.min_price, product.discount_percent);
                  const images = product.images || [];
                  const defaultImage = images[0]?.image_url
                    ? `${urlImage}product/${images[0].image_url}`
                    : "https://via.placeholder.com/150";
                  const hoverImage = images[1]?.image_url
                    ? `${urlImage}product/${images[1].image_url}`
                    : defaultImage;

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className={
                        viewMode === "grid"
                          ? "bg-white p-4 rounded-lg shadow-md relative"
                          : "bg-white p-4 rounded-lg shadow-md flex gap-4"
                      }
                    >
                      <div className={viewMode === "grid" ? "relative" : "relative w-1/4"}>
                        <img
                          src={defaultImage}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded"
                        />
                        <img
                          src={hoverImage}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded absolute top-0 left-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        />
                        {product.discount_percent && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{product.discount_percent}%
                          </span>
                        )}
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                          <button
                            onClick={() => handleAddToWishlist(product.id)}
                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                            title={wishlistStatus[product.id] ? "Bỏ yêu thích" : "Yêu thích"}
                          >
                            {wishlistStatus[product.id] ? (
                              <IoHeart className="text-red-500" />
                            ) : (
                              <IoHeartOutline />
                            )}
                          </button>
                          <Link
                            to={`/product/${product.id}`}
                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                            title="Xem chi tiết"
                          >
                            <IoEyeOutline />
                          </Link>
                        </div>
                      </div>
                      <div className={viewMode === "grid" ? "" : "flex-1"}>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-lg font-semibold hover:text-blue-500">{product.name}</h3>
                        </Link>
                        <div className="flex gap-1 my-2">{renderStars(product.average_rating)}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-500">{salePrice}₫</span>
                          {comparePrice && <del className="text-gray-500">{comparePrice}₫</del>}
                        </div>
                        {viewMode === "list" && (
                          <p className="text-sm text-gray-600 mt-2">
                            {product.description || "Không có mô tả."}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {products.length < pagination.total && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Thêm
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductList;