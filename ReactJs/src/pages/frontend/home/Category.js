import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const urlImage = "https://zstore.click/images/";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null); // Theo dõi danh mục đang được hover

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://zstore.click/api/frontend/category/list"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data.category_list);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="space-y-4 w-full max-w-4xl px-4"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        {/* Placeholder cho tiêu đề hoặc section chính */}
        <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
        {/* Placeholder cho nội dung (grid hoặc danh sách) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-40 w-full bg-gray-300 rounded-lg"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="category">
      <div className="container">
        <div className="category-item-container has-scrollbar">
          {categories.map((category) => {
            const images = JSON.parse(category.image); 

            const firstImage = images[0]; // Ảnh đầu tiên
            const secondImage = images[1] || firstImage; // Ảnh thứ hai, fallback về ảnh đầu nếu không có

            return (
              <div
                className="category-item"
                key={category.id}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="category-img-box">
                  <img
                    src={
                      hoveredCategory === category.id
                        ? `${urlImage}category/${secondImage}`
                        : `${urlImage}category/${firstImage}`
                    }
                    alt={category.name}
                    width="30"
                    style={{ transition: "opacity 0.3s ease" }} // Hiệu ứng chuyển đổi mượt mà
                  />
                </div>
                <div className="category-content-box">
                  <div className="category-content-flex">
                    <h3 className="category-item-title">{category.name}</h3>
                    <p className="category-item-amount">({category.product_count})</p>
                  </div>
                  <Link to={`/product/all?category_id=${category.id}`} className="category-btn">
                    Show all
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Category;