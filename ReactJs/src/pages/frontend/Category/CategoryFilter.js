import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import axios from "axios";

import CategoryService from "../../../services/Categoryservice";

const CategoryFilter = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  });
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();
        if (response.status) {
          const allProductsCategory = {
            id: "all",
            name: "Tất cả sản phẩm",
            product_count: 0,
          };
          const categoryList = [allProductsCategory, ...response.category_list];
          setCategories(categoryList);

          const selectedId =
            categoryId || searchParams.get("category_id") || "all";
          let selected = categoryList.find(
            (cat) => cat.id.toString() === selectedId.toString()
          );

          if (!selected) {
            for (const category of categoryList) {
              if (category.children && category.children.length > 0) {
                const child = category.children.find(
                  (child) => child.id.toString() === selectedId.toString()
                );
                if (child) {
                  selected = child;
                  break;
                }
                // Tìm trong danh mục con cấp 2
                for (const child of category.children) {
                  if (child.children && child.children.length > 0) {
                    const grandchild = child.children.find(
                      (grandchild) =>
                        grandchild.id.toString() === selectedId.toString()
                    );
                    if (grandchild) {
                      selected = grandchild;
                      break;
                    }
                  }
                }
              }
            }
          }

          selected = selected || allProductsCategory;

          setSelectedCategory({
            id: selected.id,
            name: selected.name,
          });

          if (selectedId !== selected.id) {
            setSearchParams({ category_id: selected.id }, { replace: true });
          }

          setLoadingCategories(false);
        } else {
          setError(response.message || "Không thể tải danh mục sản phẩm");
          toast.error(response.message || "Không thể tải danh mục sản phẩm");
          setLoadingCategories(false);
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh mục sản phẩm");
        toast.error(err.message || "Không thể tải danh mục sản phẩm");
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [categoryId]);

  const fetchProducts = async () => {
    if (!selectedCategory) return;

    setLoadingProducts(true);
    try {
      let response;
      if (selectedCategory.id === "all") {
        response = await axios.get(
          "http://127.0.0.1:8000/api/frontend/product_all"
        );
        if (response.data.status) {
          const allProducts = response.data.products;
          const total = allProducts.length;
          const lastPage = Math.ceil(total / pagination.per_page);
          const start = (pagination.current_page - 1) * pagination.per_page;
          const paginatedProducts = allProducts.slice(
            start,
            start + pagination.per_page
          );
          setProducts(paginatedProducts);
          setPagination({
            ...pagination,
            total,
            last_page: lastPage,
          });
        } else {
          setError(response.data.message || "Không thể tải sản phẩm");
          toast.error(response.data.message || "Không thể tải sản phẩm");
        }
      } else {
        response = await CategoryService.getProductsByCategory(
          selectedCategory.id,
          pagination.current_page,
          pagination.per_page
        );
        if (response.status) {
          setProducts(response.data.products);
          setPagination(response.data.pagination);
        } else {
          setError(response.message || "Không thể tải sản phẩm");
          toast.error(response.message || "Không thể tải sản phẩm");
        }
      }
      setLoadingProducts(false);
    } catch (err) {
      setError(err.message || "Không thể tải sản phẩm");
      toast.error(err.message || "Không thể tải sản phẩm");
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, pagination.current_page, pagination.per_page]);

  const handleCategorySelect = (category) => {
    setSelectedCategory({ id: category.id, name: category.name });
    setPagination({ ...pagination, current_page: 1 });
    setError(null);
    setSearchParams({ category_id: category.id }, { replace: true });
    navigate(`/category/${category.id}`, { replace: true });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPagination({ ...pagination, current_page: newPage });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const categoryVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const productVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loadingCategories) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-lg mt-4">Đang tải danh mục...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">
        Danh Mục Sản Phẩm
      </h1>

      {error && (
        <motion.div
          className="text-red-500 mb-4 text-center"
          variants={errorVariants}
          initial="hidden"
          animate="visible"
        >
          {error}
          <button
            onClick={() => fetchProducts()}
            className="ml-2 text-orange-500 underline"
          >
            Thử lại
          </button>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-orange-500">
            Danh Mục
          </h2>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <motion.li
                key={category.id}
                custom={index}
                variants={categoryVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="space-y-2"
              >
                <button
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory?.id === category.id
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
                        custom={index + childIndex + 1}
                        variants={categoryVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="space-y-1"
                      >
                        <button
                          onClick={() => handleCategorySelect(child)}
                          className={`w-full text-left px-3 py-1 rounded-md ${
                            selectedCategory?.id === child.id
                              ? "bg-orange-500 text-white"
                              : "text-gray-600 hover:bg-orange-100"
                          }`}
                        >
                          {child.name} ({child.product_count})
                        </button>
                        {child.children && child.children.length > 0 && (
                          <ul className="ml-4 space-y-1">
                            {child.children.map((grandchild, grandchildIndex) => (
                              <motion.li
                                key={grandchild.id}
                                custom={index + childIndex + grandchildIndex + 2}
                                variants={categoryVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                              >
                                <button
                                  onClick={() => handleCategorySelect(grandchild)}
                                  className={`w-full text-left px-3 py-1 rounded-md ${
                                    selectedCategory?.id === grandchild.id
                                      ? "bg-orange-500 text-white"
                                      : "text-gray-600 hover:bg-orange-100"
                                  }`}
                                >
                                  {grandchild.name} ({grandchild.product_count})
                                </button>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-3/4">
          {loadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-lg mt-4">
                  Đang tải sản phẩm...
                </p>
              </motion.div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-center">
              Không có sản phẩm nào trong danh mục này.
            </p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-orange-500">
                {selectedCategory?.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    custom={index}
                    variants={productVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={
                        product.image ||
                        (product.images?.[0]?.image_url
                          ? `http://127.0.0.1:8000/images/product/${product.images[0].image_url}`
                          : "http://127.0.0.1:8000/images/placeholder.png")
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-3"
                      onError={(e) => {
                        e.target.src =
                          "http://127.0.0.1:8000/images/placeholder.png";
                      }}
                    />
                    <h3 className="text-lg font-medium text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-orange-500 font-semibold">
                      {(product.price || product.min_price)?.toLocaleString()} ₫
                    </p>
                    <p className="text-gray-600 text-sm">
                      Tồn kho: {product.total_qty || product.qty}
                    </p>
                    {product.discount_percent && (
                      <p className="text-green-500 text-sm">
                        Giảm giá: {product.discount_percent}%
                      </p>
                    )}
                    {product.average_rating && (
                      <p className="text-yellow-500 text-sm">
                        Đánh giá:{" "}
                        {parseFloat(product.average_rating).toFixed(1)}/5
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;