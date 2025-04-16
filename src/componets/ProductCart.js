import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductCart = ({ product }) => {
  const urlImage = "http://localhost/NimAnLuc_CDTT/public/images/";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(3000);

  const getProductImage = () => {
    if (product.images && product.images.length > 0 && product.images[currentImageIndex]) {
        return urlImage + "product/" + product.images[currentImageIndex].thumbnail;
    }
    return ""; 
};


  // Tạo hiệu ứng nhảy ảnh
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex >= product.images.length - 1 ? 0 : prevIndex + 1
        );
    }, intervalTime);

    return () => clearInterval(interval);
}, [product.images, intervalTime]);


  // Hàm xử lý sự kiện hover vào ảnh
  const handleMouseEnter = () => {
    setIntervalTime(1000); // Thay đổi thời gian nhảy ảnh thành 1 giây khi hover
  };

  // Hàm xử lý sự kiện khi chuột rời khỏi ảnh
  const handleMouseLeave = () => {
    setIntervalTime(3000); // Đặt lại thời gian nhảy ảnh thành 3 giây
  };

  if (!product || !product.images) {
    return <p className="text-center">Đang tải sản phẩm...</p>;
}


  return (
    <div className="border group hover:shadow-lg hover:shadow-orange-500 border-amber-400 rounded-md bg-slate-100 relative overflow-hidden">
      <Link to={`/product_detail/${product.slug}`}>
        <div className="transition-all duration-700 ease-in-out group-hover:scale-105">
          <div className="flex flex-row">
            <h2 className="text-xl font-medium p-6">{product.catname}</h2>
            <div className="ml-auto p-4 flex items-end">
              <img
                className="w-[130px] h-[45px] object-contain"
                src="https://vnggames.com/_next/image?url=%2Fassets%2Fimages%2Ftag-new-release.webp&w=1920&q=100"
                alt="Tag"
              />
            </div>
          </div>

          <h2 className="p-3 text-2xl font-medium">{product.name}</h2>
          <div className="p-3 text-xl">
            <i className="fa-solid fa-globe"></i> VN, TH, HK, TW, SG
          </div>

          {/* Hiển thị ảnh theo index hiện tại */}
          <img
            className="w-[300px] h-[500px] mx-auto p-4 object-cover"
            src={getProductImage()} // Sử dụng hàm trả về ảnh
            alt={product.name}
            onMouseEnter={handleMouseEnter} // Thêm sự kiện khi hover
            onMouseLeave={handleMouseLeave} // Thêm sự kiện khi rời chuột
          />
        </div>
      </Link>

      <div className="flex flex-row bg-white">
        <div className="md:basis-1/2 text-center text-orange-600 text-xl p-4 hover:bg-orange-600 hover:rounded-md hover:text-white">
          <i className="fa-brands fa-windows"></i>
        </div>

        {/* Phần hiển thị giá */}
        <div className="md:basis-1/2 text-center text-orange-600 p-2 hover:bg-orange-600 hover:rounded-md hover:text-white">
          {product.price_sale ? (
            <div>
              <div className="text-xl text-red-600">
                {product.price_sale.toLocaleString()} VND
              </div>
              <div className="line-through text-xs text-gray-800">
                {product.price.toLocaleString()} VND
              </div>
            </div>
          ) : (
            <div className="text-xl">{product.price.toLocaleString()} VND</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
