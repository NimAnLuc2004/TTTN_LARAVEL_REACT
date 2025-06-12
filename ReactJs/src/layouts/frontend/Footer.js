import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Footer = () => {
  const [footerBrands, setFooterBrands] = useState([]);
  const [categoriesLinks, setCategoriesLinks] = useState([]);
  const [privacyPolicy, setPrivacyPolicy] = useState([]);
  const [newsLinks, setNewsLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch(
          "https://zstore.click/api/frontend/menu_footer/10"
        );
        const data = await response.json();

        if (data.status && data.menus) {
          // Lọc brand cho Thương Hiệu
          const brands = data.menus
            .filter((menu) => menu.type === "brand")
            .map((brand) => ({
              name: brand.name,
              link: brand.link,
            }));

          // Lọc category cho Danh Mục
          const categories = data.menus
            .filter((menu) => menu.type === "category")
            .map((category) => ({
              name: category.name,
              link: category.link,
            }));

          // Lọc custom cho Công Ty Chúng Tôi
          const customerLinks = data.menus
            .filter((menu) => menu.type === "custom")
            .map((menu) => ({
              name: menu.name,
              link: menu.link,
            }));

          // Lọc news cho Tin Tức
          const news = data.menus
            .filter((menu) => menu.type === "new")
            .map((menu) => ({
              name: menu.name,
              link: menu.link,
            }));

          setFooterBrands(brands);
          setCategoriesLinks(categories);
          setPrivacyPolicy(customerLinks);
          setNewsLinks(news);
        } else {
          toast.error(data.message || "Không thể tải dữ liệu footer.");
        }

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Đã xảy ra lỗi khi tải dữ liệu footer."
        );
        toast.error("Không thể tải dữ liệu footer.");
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 flex justify-center items-center h-32">
          <motion.div
            className="flex space-x-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full opacity-75"></div>
            <div className="w-4 h-4 bg-white rounded-full opacity-50"></div>
          </motion.div>
        </div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <p>Lỗi: {error}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 flex gap-8">
        <div className="flex-1">
          {/* Thương Hiệu */}
          {footerBrands.length > 0 && (
            <div className="footer-brands mb-6">
              <div className="flex items-center flex-wrap gap-4">
                <h2 className="text-lg font-semibold">Thương Hiệu:</h2>
                <div className="flex flex-wrap gap-4">
                  {footerBrands.map((brand, index) => (
                    <div className="footer-brand-item" key={index}>
                      <a
                        href={brand.link}
                        className="text-gray-400 hover:text-white"
                      >
                        {brand.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Danh Mục */}
          {categoriesLinks.length > 0 && (
            <div className="footer-categories mb-6">
              <div className="flex items-center flex-wrap gap-4">
                <h2 className="text-lg font-semibold">Danh Mục:</h2>
                <div className="flex flex-wrap gap-4">
                  {categoriesLinks.map((category, index) => (
                    <div className="footer-category-item" key={index}>
                      <a
                        href={category.link}
                        className="text-gray-400 hover:text-white"
                      >
                        {category.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Công Ty Chúng Tôi */}
          {privacyPolicy.length > 0 && (
            <div className="footer-privacy-policy mb-6">
              <h2 className="text-lg font-semibold mb-4">Công Ty Chúng Tôi</h2>
              <div className="flex flex-wrap gap-4">
                {privacyPolicy.map((policy, index) => (
                  <div className="footer-privacy-policy-item" key={index}>
                    <a
                      href={policy.link}
                      className="text-gray-400 hover:text-white"
                    >
                      {policy.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tin Tức */}
          {newsLinks.length > 0 && (
            <div className="footer-news">
              <div className="flex items-center flex-wrap gap-4">
                <h2 className="text-lg font-semibold">Tin Tức:</h2>
                <div className="flex flex-wrap gap-4">
                  {newsLinks.map((news, index) => (
                    <div className="footer-news-item" key={index}>
                      <a
                        href={news.link}
                        className="text-gray-400 hover:text-white"
                      >
                        {news.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Bản quyền */}
      <div className="container mx-auto px-4 mt-8 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Nìm An Lực. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;