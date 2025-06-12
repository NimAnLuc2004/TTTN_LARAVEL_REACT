import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
const Slider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoSlideRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("https://zstore.click/api/frontend/banner_list");
        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }
        const data = await response.json();
        setBanners(data.banner_list);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Tự động chuyển slide
  useEffect(() => {
    if (banners.length > 0) {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000); // Chuyển slide mỗi 5 giây

      return () => clearInterval(autoSlideRef.current); // Dọn dẹp khi component unmount
    }
  }, [banners]);

  const handlePrevSlide = () => {
    clearInterval(autoSlideRef.current); // Dừng tự động khi người dùng tương tác
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNextSlide = () => {
    clearInterval(autoSlideRef.current); // Dừng tự động khi người dùng tương tác
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index) => {
    clearInterval(autoSlideRef.current); // Dừng tự động khi người dùng tương tác
    setCurrentSlide(index);
  };
if (loading) {
  return (
    <div className="banner bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          {/* Placeholder cho banner chính (hình chữ nhật lớn) */}
          <div className="h-64 w-full bg-gray-300 rounded-lg"></div>
          {/* Placeholder cho các banner phụ hoặc carousel (tùy chọn) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-32 w-full bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

  const urlImage = "https://zstore.click/images/";
  if (error) {
    return (
      <div className="banner bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="banner bg-gray-100 py-8 relative">
      <div className="container mx-auto px-4">
        <div className="slider-container has-scrollbar relative">
          {banners.length > 0 ? (
            <div
              className="slider-wrapper flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div className="slider-item flex-shrink-0 w-full" key={index}>
                  <img
                    src={`${urlImage}banner/${JSON.parse(banner.image)[0]}`}
                    alt={banner.name}
                    className="banner-img w-full h-auto object-cover"
                  />
                  <div className="banner-content absolute top-1/2 left-8 transform -translate-y-1/2 text-white">
    
                    <h2 className="banner-title text-2xl md:text-4xl font-bold mt-2">
                      {banner.name}
                    </h2>
                    <a
                      href={banner.link}
                      className="banner-btn inline-block mt-4 px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
                    >
                      Mua Ngay
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No banners available</p>
          )}

          {/* Nút điều hướng */}
          {banners.length > 1 && (
            <>
              <button
                onClick={handlePrevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
              >
                &larr;
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
              >
                &rarr;
              </button>

              {/* Chấm điều hướng */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      currentSlide === index ? "bg-white" : "bg-gray-400"
                    }`}
                  ></button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;