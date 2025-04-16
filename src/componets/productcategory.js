import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../services/Categoryservice'; 

const CategoryFilter = ({ selectedCategory, setSelectedCategory, products }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API để lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await CategoryService.index();
        const activeCategories = result.categories.filter(
          (category) => category.status === 1
        );
        setCategories(activeCategories);
      } catch (error) {
        setError("Có lỗi khi lấy dữ liệu danh mục.");
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Chạy 1 lần khi component mount

  const onCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate(categoryId === "TẤT CẢ" ? "/san-pham" : `/san-pham/${categoryId}`);
  };

  if (loading) return <div>Loading categories...</div>; // Hiển thị thông báo khi đang tải
  if (error) return <div>{error}</div>; // Hiển thị thông báo lỗi nếu có

  return (
    <div className="container mx-auto">
      <div className="flex space-x-2 overflow-x-auto p-4">
        <button
          className={`flex items-center px-4 py-2 rounded-md focus:outline-none transition duration-300 ${
            selectedCategory === "TẤT CẢ"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-black hover:bg-orange-500 hover:text-white"
          }`}
          onClick={() => onCategorySelect("TẤT CẢ")}
        >
          TẤT CẢ{" "}
          <span className="ml-2 bg-white text-orange-500 rounded-full px-2 py-0.5">
            {products.length}
          </span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center px-4 py-2 rounded-md focus:outline-none transition duration-300 ${
              selectedCategory === category.id
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-black hover:bg-orange-500 hover:text-white"
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            {category.name}
            <span className="ml-2 bg-white text-orange-500 rounded-full px-2 py-0.5">
              {products.filter((p) => p.catid === category.id).length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
