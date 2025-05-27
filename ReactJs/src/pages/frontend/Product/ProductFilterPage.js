import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IoStarSharp,
  IoStarHalfOutline,
  IoStarOutline,
  IoHeartOutline,
  IoHeart,
  IoEyeOutline,
} from "react-icons/io5";
import { debounce } from "lodash";
import CategoryService from "../../../services/Categoryservice";

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

const ProductFilterPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: searchParams.get("category_id")
      ? parseInt(searchParams.get("category_id"))
      : "all",
    brandId: searchParams.get("brand_id")
      ? parseInt(searchParams.get("brand_id"))
      : null,
    sortPrice: searchParams.get("sort_price") || "default",
    sortDate: searchParams.get("sort_date") || "newest",
    priceMin: searchParams.get("price_min") || "",
    priceMax: searchParams.get("price_max") || "",
    searchQuery: searchParams.get("search_query") || "", // Thêm từ khóa tìm kiếm
  });
  const [tempPriceMin, setTempPriceMin] = useState(filters.priceMin);
  const [tempPriceMax, setTempPriceMax] = useState(filters.priceMax);
  const [tempSearchQuery, setTempSearchQuery] = useState(filters.searchQuery); // Trạng thái tạm thời cho tìm kiếm
  const [pagination, setPagination] = useState({
    current_page: parseInt(searchParams.get("page")) || 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const { id: userId } = JSON.parse(localStorage.getItem("user") || "{}");

  // Debounce hàm cập nhật tìm kiếm
  const debouncedSetSearchQuery = useCallback(
    debounce((value) => {
      setFilters((prev) => ({
        ...prev,
        searchQuery: value,
      }));
      setPagination((prev) => ({ ...prev, current_page: 1 }));
    }, 1000),
    []
  );

  useEffect(() => {
    if (!userId || !token) {
      toast.warn("Vui lòng đăng nhập để sử dụng đầy đủ tính năng!");
    }
  }, [userId]);

  // Fetch categories and brands
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const categoryResponse = await CategoryService.getCategories();
        if (categoryResponse.status) {
          const allProductsCategory = {
            id: "all",
            name: "Tất cả sản phẩm",
            product_count: 0,
          };
          const categoryList = [
            allProductsCategory,
            ...categoryResponse.category_list,
          ];
          setCategories(categoryList);

          // Kiểm tra category_id từ URL
          const categoryIdFromUrl = parseInt(searchParams.get("category_id"));
          if (categoryIdFromUrl) {
            // Tìm trong danh mục cha, con, và cháu
            const findCategory = (categories) => {
              for (const cat of categories) {
                if (cat.id === categoryIdFromUrl) return true;
                if (cat.children && cat.children.length > 0) {
                  if (findCategory(cat.children)) return true;
                }
              }
              return false;
            };

            if (!findCategory(categoryList)) {
              setError("Danh mục không tồn tại.");
              toast.error("Danh mục không tồn tại.");
              setFilters((prev) => ({ ...prev, categoryId: "all" }));
            }
          }
        } else {
          setError(categoryResponse.message || "Không thể tải danh mục");
          toast.error(categoryResponse.message || "Không thể tải danh mục");
        }

        const brandsResponse = await axios.get(`${API_URL}/get_all_brands`);
        if (brandsResponse.data.status) {
          setBrands(brandsResponse.data.data.brands);
        } else {
          setError(brandsResponse.data.message || "Không thể tải thương hiệu");
          toast.error(
            brandsResponse.data.message || "Không thể tải thương hiệu"
          );
        }

        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu ban đầu.");
        toast.error("Không thể tải dữ liệu ban đầu.");
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [searchParams]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        if (filters.categoryId === "all") {
          response = await axios.get(`${API_URL}/product_all1`, {
            params: {
              page: pagination.current_page,
              per_page: pagination.per_page,
            },
          });
        } else {
          response = await CategoryService.getProductsByCategory(
            filters.categoryId,
            pagination.current_page,
            pagination.per_page
          );
        }

        if (response.status || response.data.status) {
          let fetchedProducts =
            filters.categoryId === "all"
              ? response.data.products
              : response.data.products;

          // Lọc theo thương hiệu
          if (filters.brandId) {
            fetchedProducts = fetchedProducts.filter(
              (product) => product.brand_id === parseInt(filters.brandId)
            );
          }

          // Lọc theo giá
          if (filters.priceMin !== "" || filters.priceMax !== "") {
            const minPrice =
              filters.priceMin !== "" ? parseFloat(filters.priceMin) : 0;
            const maxPrice =
              filters.priceMax !== "" ? parseFloat(filters.priceMax) : Infinity;
            fetchedProducts = fetchedProducts.filter((product) => {
              const salePrice = parseFloat(
                calculateSalePrice(
                  product.min_price || product.price,
                  product.discount_percent
                ).salePrice
              );
              return salePrice >= minPrice && salePrice <= maxPrice;
            });
          }

          // Lọc theo từ khóa tìm kiếm
          if (filters.searchQuery !== "") {
            const query = filters.searchQuery.toLowerCase();
            fetchedProducts = fetchedProducts.filter((product) =>
              product.name.toLowerCase().includes(query)
            );
          }

          // Sắp xếp sản phẩm
          fetchedProducts = [...fetchedProducts].sort((a, b) => {
            if (filters.sortPrice !== "default") {
              const priceA = parseFloat(
                calculateSalePrice(a.min_price || a.price, a.discount_percent)
                  .salePrice
              );
              const priceB = parseFloat(
                calculateSalePrice(b.min_price || b.price, b.discount_percent)
                  .salePrice
              );
              if (priceA !== priceB) {
                return filters.sortPrice === "asc"
                  ? priceA - priceB
                  : priceB - priceA;
              }
            }
            if (filters.sortDate === "newest") {
              return new Date(b.created_at) - new Date(a.created_at);
            } else {
              return new Date(a.created_at) - new Date(b.created_at);
            }
          });

          setProducts(fetchedProducts);
          setPagination({
            current_page:
              filters.categoryId === "all"
                ? response.data.pagination.current_page
                : response.data.pagination.current_page,
            per_page:
              filters.categoryId === "all"
                ? response.data.pagination.per_page
                : response.data.pagination.per_page,
            total:
              filters.brandId ||
              filters.priceMin ||
              filters.priceMax ||
              filters.searchQuery
                ? fetchedProducts.length
                : filters.categoryId === "all"
                ? response.data.pagination.total
                : response.data.pagination.total,
            last_page:
              filters.brandId ||
              filters.priceMin ||
              filters.priceMax ||
              filters.searchQuery
                ? Math.ceil(fetchedProducts.length / pagination.per_page)
                : filters.categoryId === "all"
                ? response.data.pagination.last_page
                : response.data.pagination.last_page,
          });

          if (userId && token) {
            const wishlistChecks = await Promise.all(
              fetchedProducts.map(async (product) => {
                const variantId =
                  product.product_details?.[0]?.id || product.id;
                try {
                  const res = await axios.get(
                    `${API_URL}/wishlist/check/${variantId}`
                  );
                  return {
                    productId: product.id,
                    isWishlisted: res.data.isWishlisted,
                  };
                } catch (err) {
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
            setWishlistStatus(wishlistStatusMap);
          }
        } else {
          setError(response.data.message || "Không thể tải sản phẩm");
          toast.error(response.data.message || "Không thể tải sản phẩm");
        }
      } catch (err) {
        setError("Không thể tải sản phẩm.");
        toast.error("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchProducts();
    }
  }, [
    filters.categoryId,
    filters.brandId,
    filters.sortPrice,
    filters.sortDate,
    filters.priceMin,
    filters.priceMax,
    filters.searchQuery, // Thêm phụ thuộc tìm kiếm
    pagination.current_page,
    pagination.per_page,
    categories,
  ]);

  // Sync filters with URL
  useEffect(() => {
    setSearchParams({
      category_id: filters.categoryId,
      brand_id: filters.brandId || "",
      sort_price: filters.sortPrice,
      sort_date: filters.sortDate,
      price_min: filters.priceMin,
      price_max: filters.priceMax,
      search_query: filters.searchQuery, // Thêm vào URL
      page: pagination.current_page.toString(),
    });
  }, [filters, pagination.current_page, setSearchParams]);

  const handleCategorySelect = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: categoryId === "all" ? "all" : parseInt(categoryId),
    }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    setError(null);
  };

  const handleBrandSelect = (brandId) => {
    setFilters((prev) => ({ ...prev, brandId }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    setError(null);
  };

  const handleSortPrice = (order) => {
    setFilters((prev) => ({ ...prev, sortPrice: order }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handleSortDate = (order) => {
    setFilters((prev) => ({ ...prev, sortDate: order }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  // Xử lý thay đổi giá tạm thời
  const handleTempPriceChange = (e) => {
    const { name, value } = e.target;
    if (name === "priceMin") {
      setTempPriceMin(value);
    } else if (name === "priceMax") {
      setTempPriceMax(value);
    }
  };

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTempSearchQuery(value);
    debouncedSetSearchQuery(value);
  };

  // Xử lý khi nhấn nút Xác nhận giá
  const handleApplyPriceFilter = () => {
    const min = tempPriceMin !== "" ? parseFloat(tempPriceMin) : "";
    const max = tempPriceMax !== "" ? parseFloat(tempPriceMax) : "";
    if (min !== "" && max !== "" && min > max) {
      toast.error("Giá tối thiểu không thể lớn hơn giá tối đa!");
      return;
    }

    setFilters((prev) => ({
      ...prev,
      priceMin: tempPriceMin,
      priceMax: tempPriceMax,
    }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
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
          toast.error(
            response.data.message || "Không thể xóa khỏi danh sách yêu thích."
          );
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
          toast.error(
            response.data.message || "Không thể thêm vào danh sách yêu thích."
          );
        }
      }
    } catch (error) {
      toast.error("Lỗi khi xử lý danh sách yêu thích.");
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
      } else if (
        i === Math.ceil(effectiveRating) &&
        effectiveRating % 1 !== 0
      ) {
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
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-48 w-full bg-gray-200 rounded mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, starIndex) => (
                  <div
                    key={starIndex}
                    className="h-4 w-4 bg-gray-200 rounded-full"
                  ></div>
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
        <div className="bg-white p-8 rounded-lg shadow-sm text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">Sản Phẩm</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Bộ Lọc</h2>

            {/* Search Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-orange-500">
                Tìm Kiếm
              </h3>
              <input
                type="text"
                value={tempSearchQuery}
                onChange={handleSearchChange}
                placeholder="Nhập tên sản phẩm..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-orange-500">
                Danh Mục
              </h3>
              {categories.length === 0 ? (
                <p className="text-gray-500">Đang tải danh mục...</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <motion.li
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          filters.categoryId === category.id
                            ? "bg-orange-500 text-white"
                            : "text-gray-700 hover:bg-orange-100"
                        }`}
                      >
                        {category.name}{" "}
                        {category.product_count > 0
                          ? `(${category.product_count})`
                          : ""}
                      </button>
                      {category.children && category.children.length > 0 && (
                        <ul className="ml-4 space-y-1">
                          {category.children.map((child, childIndex) => (
                            <motion.li
                              key={child.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: (index + childIndex + 1) * 0.1,
                              }}
                            >
                              <button
                                onClick={() => handleCategorySelect(child.id)}
                                className={`w-full text-left px-4 py-1 rounded-lg font-medium transition-all duration-200 ${
                                  filters.categoryId === child.id
                                    ? "bg-orange-500 text-white"
                                    : "text-gray-600 hover:bg-orange-100"
                                }`}
                              >
                                {child.name} ({child.product_count})
                              </button>
                              {child.children && child.children.length > 0 && (
                                <ul className="ml-4 space-y-1">
                                  {child.children.map(
                                    (grandchild, grandchildIndex) => (
                                      <motion.li
                                        key={grandchild.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: 0.5,
                                          delay:
                                            (index +
                                              childIndex +
                                              grandchildIndex +
                                              2) *
                                            0.1,
                                        }}
                                      >
                                        <button
                                          onClick={() =>
                                            handleCategorySelect(grandchild.id)
                                          }
                                          className={`w-full text-left px-4 py-1 rounded-lg font-medium transition-all duration-200 ${
                                            filters.categoryId === grandchild.id
                                              ? "bg-orange-500 text-white"
                                              : "text-gray-600 hover:bg-orange-100"
                                          }`}
                                        >
                                          {grandchild.name} (
                                          {grandchild.product_count})
                                        </button>
                                      </motion.li>
                                    )
                                  )}
                                </ul>
                              )}
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-orange-500">
                Thương Hiệu
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleBrandSelect(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      filters.brandId === null
                        ? "bg-orange-500 text-white"
                        : "text-gray-700 hover:bg-orange-100"
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
                        filters.brandId === brand.id
                          ? "bg-orange-500 text-white"
                          : "text-gray-700 hover:bg-orange-100"
                      }`}
                    >
                      {brand.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-orange-500">
                Khoảng Giá
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá tối thiểu (₫)
                  </label>
                  <input
                    type="number"
                    name="priceMin"
                    value={tempPriceMin}
                    onChange={handleTempPriceChange}
                    min="0"
                    placeholder="0"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá tối đa (₫)
                  </label>
                  <input
                    type="number"
                    name="priceMax"
                    value={tempPriceMax}
                    onChange={handleTempPriceChange}
                    min="0"
                    placeholder="∞"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <button
                  onClick={handleApplyPriceFilter}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                >
                  Xác nhận
                </button>
              </div>
            </div>

            {/* Price Sort */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-orange-500">
                Sắp xếp theo giá
              </h3>
              <select
                value={filters.sortPrice}
                onChange={(e) => handleSortPrice(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="default">Mặc định</option>
                <option value="asc">Giá: Thấp đến Cao</option>
                <option value="desc">Giá: Cao đến Thấp</option>
              </select>
            </div>

            {/* Date Sort */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-orange-500">
                Sắp xếp theo ngày
              </h3>
              <select
                value={filters.sortDate}
                onChange={(e) => handleSortDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Product List */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {categories.find((cat) => cat.id === filters.categoryId)
                  ?.name || "Tất cả sản phẩm"}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid" ? "bg-gray-200" : "bg-white"
                  } border hover:bg-gray-300 transition`}
                  title="Chế độ lưới"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-gray-200" : "bg-white"
                  } border hover:bg-gray-300 transition`}
                  title="Chế độ danh sách"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 8V4m0 4h4M4 16v4m0-4h4m8-8v16m-4-16v16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <motion.div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
              layout
            >
              <AnimatePresence>
                {products.map((product) => {
                  const { salePrice, comparePrice } = calculateSalePrice(
                    product.min_price || product.price,
                    product.discount_percent
                  );
                  const images = product.images || [];
                  const defaultImage = product.image
                    ? product.image
                    : images[0]?.image_url
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
                      <div
                        className={
                          viewMode === "grid" ? "relative" : "relative w-1/4"
                        }
                      >
                        <img
                          src={defaultImage}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
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
                            title={
                              wishlistStatus[product.id]
                                ? "Bỏ yêu thích"
                                : "Yêu thích"
                            }
                          >
                            {wishlistStatus[product.id] ? (
                              <IoHeart className="text-red-500" />
                            ) : (
                              <IoHeartOutline />
                            )}
                          </button>
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                            title="Xem chi tiết"
                          >
                            <IoEyeOutline />
                          </button>
                        </div>
                      </div>
                      <div className={viewMode === "grid" ? "" : "flex-1"}>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="text-lg font-semibold hover:text-blue-500"
                        >
                          {product.name}
                        </button>
                        <div className="flex gap-1 my-2">
                          {renderStars(product.average_rating)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-500">
                            {salePrice}₫
                          </span>
                          {comparePrice && (
                            <del className="text-gray-500">{comparePrice}₫</del>
                          )}
                        </div>
                        {viewMode === "list" && (
                          <p className="text-sm text-gray-600 mt-2">
                            {product.description || "Không có mô tả."}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Tồn kho: {product.qty || product.total_qty}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {products.length > 0 && (
              <div className="mt-6 flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md disabled:bg-gray-300 hover:bg-orange-600 transition"
                >
                  Trước
                </button>
                <span className="text-gray-700">
                  Trang {pagination.current_page} / {pagination.last_page}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md disabled:bg-gray-300 hover:bg-orange-600 transition"
                >
                  Sau
                </button>
                {products.length < pagination.total && (
                  <button
                    onClick={handleLoadMore}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                  >
                    Thêm
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductFilterPage;
