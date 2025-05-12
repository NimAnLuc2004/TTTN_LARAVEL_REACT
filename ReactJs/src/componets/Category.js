import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryService from "../services/Categoryservice";
import { Link } from "react-router-dom";

const urlImage = "http://localhost/NimAnLuc_CDTT/public/images/";

const GameCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải danh mục...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (categories.length === 0) {
    return <div className="text-center py-8">Không có danh mục nào để hiển thị.</div>;
  }

  return (
    <div className="w-full py-8">
      <h2 className="text-center text-2xl font-bold mb-6">Danh Mục Game</h2>

      <Slider {...settings} className="w-full">
        {/* Game Cards */}
        {categories.map((category) => (
          <div key={category.id} className="p-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition hover:scale-105">
              <img
                className="w-full h-64 object-cover"
                src={`${urlImage}category/${JSON.parse(category.image)[0]}`}
                alt={category.name}
                loading="lazy" 
              />
              <Link to={`/san-pham/${category.id}`}>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default GameCategories;
