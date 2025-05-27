import React, { useEffect, useState } from "react";
import BannerService from "../services/Bannerservice";
import { Link } from "react-router-dom";

const urlImage = "http://localhost/NimAnLuc_CDTT/public/images/";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0); // Lưu trạng thái của banner hiện tại

  useEffect(() => {
    (async () => {
      try {
        const result = await BannerService.index();
        const active = result.banners.filter(
          (banner) => banner.status === 1
        );
        setBanners(active);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    })();
  }, []);

  // Hàm chuyển đổi banner khi nhấn vào icon
  const handleIconClick = (index) => {
    setCurrentBannerIndex(index);
  };

  return (
    <div className="relative bg-orange-100">
      {/* Main Banner Section */}
      {banners.length > 0 && (
        <div className="relative bg-gradient-to-r from-orange-500 to-blue-500 h-[600px] flex items-center justify-center">
          <div
            key={banners[currentBannerIndex].id}
            className="relative w-full h-full flex items-center justify-center bg-white rounded-lg shadow-lg overflow-hidden mx-4"
            style={{
              backgroundImage: `url(${urlImage + "banner/" + JSON.parse(banners[currentBannerIndex].image)[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-transparent to-blue-500 opacity-75"></div>
            <div className="relative z-10 text-center p-8 text-white">
              <h2 className="text-4xl font-bold mb-4">{banners[currentBannerIndex].name}</h2>
              <p className="text-lg mb-4">{banners[currentBannerIndex].description}</p>
   
            </div>
          </div>
        </div>
      )}

      {/* Bottom Icons Section */}
      <div className="flex justify-center mt-6 space-x-4">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={urlImage + "banner/" + JSON.parse(banner.image)[0]}
            alt={banner.name}
            onClick={() => handleIconClick(index)} // Thay đổi banner khi click vào icon
            className={`w-[50px] h-[50px] rounded-full cursor-pointer transition-transform duration-300 ${
              currentBannerIndex === index ? "scale-110" : "hover:scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
