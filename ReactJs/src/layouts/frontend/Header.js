import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Logo from "../../assets/images/logo/logo.svg";
import UserService from "../../services/Userservice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import {
  faUser,
  faSignOutAlt,
  faHeart,
  faBagShopping,
  faMagnifyingGlass,
  faBars,
  faHome,
  faTh,
  faTimes,
  faPlus,
  faMinus,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuCateOpen, setIsMobileMenuCateOpen] = useState({});
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(
    (localStorage.getItem("token") || "").replace(/^"|"$/g, "")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const urlImage = "http://127.0.0.1:8000/images/";

  // Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/frontend/menu_list/10"
        );

        if (!response.ok) throw new Error("Không thể tải danh sách menu");
        const data = await response.json();
        setMenus(data.menus);
        setCategories(data.categories);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error(err.message); // Hiển thị toast lỗi
      }
    };
    fetchMenus();
  }, []);

  // Debounced search for suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/frontend/product_search?query=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) throw new Error("Không thể tìm kiếm sản phẩm");
      const data = await response.json();
      setSuggestions(data.products.slice(0, 5)); // Limit to 5 suggestions
      setIsSuggestionsOpen(true);
    } catch (err) {
      console.error("Lỗi tìm kiếm gợi ý:", err);
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      toast.error(err.message); // Hiển thị toast lỗi
    }
  }, []);

  // Fetch wishlist and cart counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (token) {
          // Fetch wishlist count
          const wishlistResponse = await fetch(
            "http://127.0.0.1:8000/api/frontend/wishlist/count",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!wishlistResponse.ok)
            throw new Error("Không thể lấy số lượng danh sách yêu thích");
          const wishlistData = await wishlistResponse.json();
          setWishlistCount(wishlistData.count || 0);

          // Fetch cart count
          const cartResponse = await fetch(
            "http://127.0.0.1:8000/api/frontend/cart/count",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!cartResponse.ok)
            throw new Error("Không thể lấy số lượng giỏ hàng");
          const cartData = await cartResponse.json();
          setCartCount(cartData.count || 0);
        } else {
          // For non-logged-in users, get cart count from local storage
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCartCount(localCart.length || 0);
          setWishlistCount(0); // Wishlist requires login
        }
      } catch (err) {
        console.error("Lỗi lấy số lượng:", err);
        setWishlistCount(0);
        setCartCount(0);
        toast.error(err.message); // Hiển thị toast lỗi
      }
    };

    fetchCounts();
  }, [token]);

  // Debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchSuggestions]);

  const handleLogout = async () => {
    try {
      const response = await UserService.logoutuser();
      if (!response.status) throw new Error("Đăng xuất thất bại");
      localStorage.removeItem("token");
      setToken(null);
      toast.success("Đăng xuất thành công!"); // Hiển thị toast thành công
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Lỗi đăng xuất:", err);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại!"); // Hiển thị toast lỗi
    }
  };

  const handleUserAction = () => {
    if (token) handleLogout();
    else navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileMenuCate = (id) => {
    setIsMobileMenuCateOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warn("Vui lòng nhập từ khóa tìm kiếm!"); // Hiển thị toast cảnh báo
      return;
    }
    setIsSuggestionsOpen(false);
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  const handleSuggestionClick = (productId) => {
    setIsSuggestionsOpen(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <header className="relative">
      <div className="header-top bg-gray-100 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <ul className="header-social-container flex gap-4">
            {[
              { to: "https://facebook.com", icon: faFacebookF },
              { to: "https://twitter.com", icon: faTwitter },
              { to: "https://instagram.com", icon: faInstagram },
              { to: "https://linkedin.com", icon: faLinkedinIn },
            ].map(({ to, icon }, index) => (
              <li key={index}>
                <Link
                  to={to}
                  className="social-link text-gray-600 hover:text-blue-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={icon} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="header-alert-news text-sm">
            <p>Miễn phí vận chuyển tuần này cho đơn hàng trên $55</p>
          </div>
          <div className="header-top-actions flex gap-4 items-center">
            <select
              name="currency"
              className="border rounded px-2 py-1 text-gray-700"
            >
              <option value="usd">USD $</option>
              <option value="eur">EUR €</option>
            </select>
            <select
              name="language"
              className="border rounded px-2 py-1 text-gray-700"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en-US">English</option>
              <option value="es-ES">Español</option>
              <option value="fr">Français</option>
            </select>
            <div className="relative group">
              <Link to="/contact" aria-label="Liên hệ">
                <FontAwesomeIcon
                  icon={faHome}
                  className="h-6 w-6 text-orange-500 hover:text-orange-600 transition-colors"
                />
              </Link>
              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                Liên hệ
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="header-main bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="header-logo">
            <img src={Logo} alt="Anon's logo" width="120" height="36" />
          </Link>

          <div className="header-search-container relative w-1/3">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="search"
                name="search"
                className="search-field w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên sản phẩm..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() =>
                  suggestions.length > 0 && setIsSuggestionsOpen(true)
                }
                onBlur={() =>
                  setTimeout(() => setIsSuggestionsOpen(false), 200)
                }
              />
              <button
                type="submit"
                className="search-btn absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>
            <AnimatePresence>
              {isSuggestionsOpen && suggestions.length > 0 && (
                <motion.div
                  className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer transition"
                      onClick={() => handleSuggestionClick(product.id)}
                    >
                      <img
                        src={
                          product.images?.[0].image_url
                            ? `${urlImage}product/${product.images[0].image_url}`
                            : "/placeholder.jpg"
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          ${product.min_price}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="header-user-actions flex gap-4">
            {token ? (
              <>
                <button
                  className="action-btn text-gray-600 hover:text-blue-600"
                  onClick={handleProfile}
                  title="Thông tin"
                >
                  <FontAwesomeIcon icon={faUser} />
                </button>

                <button
                  className="action-btn text-gray-600 hover:text-blue-600"
                  onClick={handleLogout}
                  title="Đăng xuất"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
                <Link to={`/wishlist`}>
                  <button className="action-btn text-gray-600 relative">
                    <FontAwesomeIcon icon={faHeart} title="Yêu thích" />
                    <span className="count absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  </button>
                </Link>
              </>
            ) : (
              <button
                className="action-btn text-gray-600 hover:text-blue-600"
                onClick={handleUserAction}
                title="Đăng nhập"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
            )}
            <Link to={`/cart`}>
              <button className="action-btn text-gray-600 relative">
                <FontAwesomeIcon icon={faBagShopping} title="Giỏ hàng" />
                <span className="count absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <nav className="desktop-navigation-menu bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <ul className="desktop-menu-category-list flex gap-4">
            {loading ? (
              <motion.ul
                className="flex gap-4"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <li key={index} className="menu-category">
                    <div className="h-6 w-24 bg-gray-300 rounded"></div>
                  </li>
                ))}
              </motion.ul>
            ) : error ? (
              <li className="menu-category">
                <p>Lỗi: {error}</p>
              </li>
            ) : (
              menus.map((menu) => (
                <li className="menu-category relative group" key={menu.id}>
                  <Link
                    to={menu.link}
                    className="menu-title text-gray-700 hover:text-blue-600 transition"
                  >
                    {menu.name}
                  </Link>
                  {menu.type === "category" && categories.length > 0 && (
                    <div
                      className="dropdown-panel absolute top-full left-0 bg-white shadow-lg rounded-md z-10"
                      style={{ width: "max-content", minWidth: "300px" }}
                    >
                      {categories
                        .filter((cat) => cat.parent_id === menu.table_id)
                        .map((category) => (
                          <ul
                            className="dropdown-panel-list p-4"
                            key={category.id}
                            style={{ maxWidth: "100%", overflow: "hidden" }}
                          >
                            <li className="menu-title font-semibold">
                              <Link
                                to={`/product/all?category_id=${category.id}`}
                                className="hover:text-blue-600"
                              >
                                {category.name}
                              </Link>
                            </li>
                            {category.subcategories?.map((subcat) => (
                              <li className="panel-list-item" key={subcat.id}>
                                <Link
                                  to={`/product/all?category_id=${subcat.id}`}
                                  className="text-gray-600 hover:text-blue-600"
                                >
                                  {subcat.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ))}
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      </nav>

      <div className="mobile-bottom-navigation fixed bottom-0 left-0 right-0 bg-white shadow-t-md py-2 md:hidden">
        <div className="container mx-auto px-4 flex justify-between">
          <button
            className="action-btn text-gray-600"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <button className="action-btn text-gray-600 relative">
            <FontAwesomeIcon icon={faBagShopping} />
            <span className="count absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </button>
          <button className="action-btn text-gray-600">
            <FontAwesomeIcon icon={faHome} />
          </button>
          {token ? (
            <>
              <button
                className="action-btn text-gray-600"
                onClick={handleProfile}
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
              <button className="action-btn text-gray-600 relative">
                <FontAwesomeIcon icon={faHeart} />
                <span className="count absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              </button>
            </>
          ) : (
            <button
              className="action-btn text-gray-600"
              onClick={handleUserAction}
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
          )}
          <button
            className="action-btn text-gray-600"
            onClick={() => toggleMobileMenuCate("categories")}
          >
            <FontAwesomeIcon icon={faTh} />
          </button>
        </div>
      </div>

      <nav
        className={`mobile-navigation-menu fixed inset-0 bg-white z-50 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:hidden`}
        data-mobile-menu
      >
        <div className="menu-top flex justify-between p-4 border-b">
          <h2 className="menu-title text-lg font-semibold">Menu</h2>
          <button
            className="menu-close-btn text-gray-600"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <ul className="mobile-menu-category-list p-4">
          {loading ? (
            <motion.ul
              className="space-y-2"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {[...Array(5)].map((_, index) => (
                <li key={index} className="menu-category">
                  <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                </li>
              ))}
            </motion.ul>
          ) : error ? (
            <li className="menu-category">
              <p>Lỗi: {error}</p>
            </li>
          ) : (
            menus.map((menu) => (
              <li className="menu-category" key={menu.id}>
                <Link
                  to={menu.link}
                  className="menu-title text-gray-700 hover:text-blue-600"
                >
                  {menu.name}
                </Link>
                {menu.type === "category" && categories.length > 0 && (
                  <div>
                    {categories
                      .filter((cat) => cat.parent_id === menu.table_id)
                      .map((category) => (
                        <div key={category.id}>
                          <button
                            className="accordion-menu flex justify-between w-full py-2"
                            onClick={() => toggleMobileMenuCate(category.id)}
                          >
                            <p className="menu-title">{category.name}</p>
                            <FontAwesomeIcon
                              icon={
                                isMobileMenuCateOpen[category.id]
                                  ? faMinus
                                  : faPlus
                              }
                            />
                          </button>
                          {category.subcategories && (
                            <ul
                              className={`submenu-category-list ${
                                isMobileMenuCateOpen[category.id]
                                  ? "block"
                                  : "hidden"
                              } pl-4`}
                            >
                              {category.subcategories.map((subcat) => (
                                <li
                                  className="submenu-category"
                                  key={subcat.id}
                                >
                                  <Link
                                    to={`/product/all?category_id=${subcat.id}`}
                                    className="submenu-title text-gray-600 hover:text-blue-600"
                                  >
                                    {subcat.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </li>
            ))
          )}
          <li className="menu-category">
            <Link
              to="/blog"
              className="menu-title text-gray-700 hover:text-blue-600"
            >
              Blog
            </Link>
          </li>
          <li className="menu-category">
            <Link
              to="/offers"
              className="menu-title text-gray-700 hover:text-blue-600"
            >
              Hot Offers
            </Link>
          </li>
        </ul>
        <div className="menu-bottom p-4 border-t">
          <ul className="menu-category-list">
            <li className="menu-category">
              <button
                className="accordion-menu flex justify-between w-full py-2"
                onClick={() => toggleMobileMenuCate("language")}
              >
                <p className="menu-title">Ngôn ngữ</p>
                <FontAwesomeIcon
                  icon={
                    isMobileMenuCateOpen["language"] ? faMinus : faCaretLeft
                  }
                />
              </button>
              <ul
                className={`submenu-category-list ${
                  isMobileMenuCateOpen["language"] ? "block" : "hidden"
                } pl-4`}
              >
                {["Tiếng Anh", "Español", "Tiếng Pháp"].map((lang) => (
                  <li className="submenu-category" key={lang}>
                    <Link
                      to="#"
                      className="submenu-title text-gray-600 hover:text-blue-600"
                    >
                      {lang}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="menu-category">
              <button
                className="accordion-menu flex justify-between w-full py-2"
                onClick={() => toggleMobileMenuCate("currency")}
              >
                <p className="menu-title">Tiền tệ</p>
                <FontAwesomeIcon
                  icon={
                    isMobileMenuCateOpen["currency"] ? faMinus : faCaretLeft
                  }
                />
              </button>
              <ul
                className={`submenu-category-list ${
                  isMobileMenuCateOpen["currency"] ? "block" : "hidden"
                } pl-4`}
              >
                {["USD $", "EUR €"].map((cur) => (
                  <li className="submenu-category" key={cur}>
                    <Link
                      to="#"
                      className="submenu-title text-gray-600 hover:text-blue-600"
                    >
                      {cur}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <ul className="menu-social-container flex gap-4 mt-4">
            {[
              { to: "https://facebook.com", icon: faFacebookF },
              { to: "https://twitter.com", icon: faTwitter },
              { to: "https://instagram.com", icon: faInstagram },
              { to: "https://linkedin.com", icon: faLinkedinIn },
            ].map(({ to, icon }, index) => (
              <li key={index}>
                <Link
                  to={to}
                  className="social-link text-gray-600 hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={icon} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
