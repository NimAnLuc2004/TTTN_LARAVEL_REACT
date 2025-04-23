import Logo from "../../assets/images/logo/logo.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

import {
  faUser,
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



import React, { useState } from "react";

import { Link } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuCateOpen, setIsMobileMenuCateOpen] = useState(false);
  const [isMobileMenuCateOpen2, setIsMobileMenuCateOpen2] = useState(false);
  const [isMobileMenuCateOpen3, setIsMobileMenuCateOpen3] = useState(false);
  const [isMobileMenuCateOpen4, setIsMobileMenuCateOpen4] = useState(false);
  const [isMobileMenuCateOpen6, setIsMobileMenuCateOpen6] = useState(false);
  const [isMobileMenuCateOpen7, setIsMobileMenuCateOpen7] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileMenuCate = () => {
    setIsMobileMenuCateOpen(!isMobileMenuCateOpen);
  };

  const toggleMobileMenuCate2 = () => {
    setIsMobileMenuCateOpen2(!isMobileMenuCateOpen2);
  };

  const toggleMobileMenuCate3 = () => {
    setIsMobileMenuCateOpen3(!isMobileMenuCateOpen3);
  };

  const toggleMobileMenuCate4 = () => {
    setIsMobileMenuCateOpen4(!isMobileMenuCateOpen4);
  };

  const toggleMobileMenuCate6 = () => {
    setIsMobileMenuCateOpen6(!isMobileMenuCateOpen6);
  };

  const toggleMobileMenuCate7 = () => {
    setIsMobileMenuCateOpen7(!isMobileMenuCateOpen7);
  };

  return (
    <header>
      <div className="header-top">
        <div className="container">
          <ul className="header-social-container">
            <li>
              <Link to="#" className="social-link">
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
            </li>
            <li>
              <Link to="#" className="social-link">
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
            </li>
            <li>
              <Link to="#" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
            </li>
            <li>
              <Link to="#" className="social-link">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </li>
          </ul>

          <div className="header-alert-news">
            <p>
              <b>Free Shipping</b>
              This Week Order Over - $55
            </p>
          </div>

          <div className="header-top-actions">
            <select name="currency">
              <option value="usd">USD $</option>
              <option value="eur">EUR €</option>
            </select>

            <select name="language">
              <option value="en-US">English</option>
              <option value="es-ES">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <Link to="#" className="header-logo">
            <img src={Logo} alt="Anon's logo" width="120" height="36" />
          </Link>

          <div className="header-search-container">
            <input
              type="search"
              name="search"
              className="search-field"
              placeholder="Enter your product name..."
            />

            <button className="search-btn">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>

          <div className="header-user-actions">
            <button className="action-btn">
              <FontAwesomeIcon icon={faUser} />
            </button>
            <button className="action-btn">
              <FontAwesomeIcon icon={faHeart} />
              <span className="count">0</span>
            </button>
            <button className="action-btn">
              <FontAwesomeIcon icon={faBagShopping} />
              <span className="count">0</span>
            </button>
          </div>
        </div>
      </div>

      <nav className="desktop-navigation-menu">
        <div className="container">
          <ul className="desktop-menu-category-list">
            <li className="menu-category">
              <Link to="#" className="menu-title">
                Home
              </Link>
            </li>

            <li className="menu-category">
              <Link to="#" className="menu-title">
                Categories
              </Link>

              <div className="dropdown-panel">
                <ul className="dropdown-panel-list">
                  <li className="menu-title">
                    <Link to="#">Electronics</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Desktop</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Laptop</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Camera</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Tablet</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Headphone</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">
                      <img
                        src={require("../../assets/images/electronics-banner-1.jpg")}
                        alt="headphone collection"
                        width="250"
                        height="119"
                      />
                    </Link>
                  </li>
                </ul>

                <ul className="dropdown-panel-list">
                  <li className="menu-title">
                    <Link to="#">Men's</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Formal</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Casual</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Sports</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Jacket</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Sunglasses</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">
                      <img
                        src={require("../../assets/images/mens-banner.jpg")}
                        alt="men's fashion"
                        width="250"
                        height="119"
                      />
                    </Link>
                  </li>
                </ul>

                <ul className="dropdown-panel-list">
                  <li className="menu-title">
                    <Link to="#">Women's</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Formal</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Casual</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Perfume</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Cosmetics</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Bags</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">
                      <img
                        src={require("../../assets/images/womens-banner.jpg")}
                        alt="women's fashion"
                        width="250"
                        height="119"
                      />
                    </Link>
                  </li>
                </ul>

                <ul className="dropdown-panel-list">
                  <li className="menu-title">
                    <Link to="#">Electronics</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Smart Watch</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Smart TV</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Keyboard</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Mouse</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">Microphone</Link>
                  </li>

                  <li className="panel-list-item">
                    <Link to="#">
                      <img
                        src={require("../../assets/images/electronics-banner-2.jpg")}
                        alt="mouse collection"
                        width="250"
                        height="119"
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="menu-category">
              <Link to="#" className="menu-title">
                Men's
              </Link>

              <ul className="dropdown-list">
                <li className="dropdown-item">
                  <Link to="#">Shirt</Link>
                </li>
                <li className="dropdown-item">
                  <Link to="#">Shorts & Jeans</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Safety Shoes</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Wallet</Link>
                </li>
              </ul>
            </li>

            <li className="menu-category">
              <Link to="#" className="menu-title">
                Women's
              </Link>

              <ul className="dropdown-list">
                <li className="dropdown-item">
                  <Link to="#">Dress & Frock</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Earrings</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Necklace</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Makeup Kit</Link>
                </li>
              </ul>
            </li>

            <li className="menu-category">
              <Link to="#" className="menu-title">
                Jewelry
              </Link>

              <ul className="dropdown-list">
                <li className="dropdown-item">
                  <Link to="#">Earrings</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Couple Rings</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Necklace</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Bracelets</Link>
                </li>
              </ul>
            </li>

            <li className="menu-category">
              <Link to="#" className="menu-title">
                Perfume
              </Link>

              <ul className="dropdown-list">
                <li className="dropdown-item">
                  <Link to="#">Clothes Perfume</Link>
                </li>
                <li className="dropdown-item">
                  <Link to="#">Deodorant</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Flower Fragrance</Link>
                </li>

                <li className="dropdown-item">
                  <Link to="#">Air Freshener</Link>
                </li>
              </ul>
            </li>

            <li className="menu-category">
              <Link to="#" className="menu-title">
                Blog
              </Link>
            </li>

            <li className="menu-category">
              <Link to="#" className="menu-title">
                Hot Offers
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mobile-bottom-navigation">
        <button
          className="action-btn"
          data-mobile-menu-open-btn
          onClick={toggleMobileMenu}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <button className="action-btn">
          <FontAwesomeIcon icon={faBagShopping} />
          <span className="count">0</span>
        </button>

        <button className="action-btn">
          <FontAwesomeIcon icon={faHome} />
        </button>

        <button className="action-btn">
          <FontAwesomeIcon icon={faHeart} />
          <span className="count">0</span>
        </button>

        <button
          className="action-btn"
          data-mobile-menu-open-btn
          onClick={toggleMobileMenuCate}
        >
          <FontAwesomeIcon icon={faTh} />
        </button>
      </div>

      <nav
        className={`mobile-navigation-menu ${isMobileMenuOpen ? "active" : ""}`}
        data-mobile-menu
      >
        <div className="menu-top">
          <h2 className="menu-title">Menu</h2>

          <button
            className="menu-close-btn"
            data-mobile-menu-close-btn
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <ul className="mobile-menu-category-list">
          <li className="menu-category">
            <Link to="#" className="menu-title">
              Home
            </Link>
          </li>

          <li className="menu-category">
            <button
              className="accordion-menu"
              data-accordion-btn
              onClick={toggleMobileMenuCate2}
            >
              <p className="menu-title">Men's</p>

              <div>
                <FontAwesomeIcon
                  icon={isMobileMenuCateOpen2 ? faMinus : faPlus}
                />
              </div>
            </button>

            <ul
              className={`submenu-category-list ${
                isMobileMenuCateOpen2 ? "active" : ""
              }`}
            >
              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Shirt
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Shorts & Jeans
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Safety Shoes
                </Link>
              </li>
              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Wallet
                </Link>
              </li>
            </ul>
          </li>

          <li className="menu-category">
            <button
              className="accordion-menu"
              data-accordion-btn
              onClick={toggleMobileMenuCate}
            >
              <p className="menu-title">Women's</p>

              <div>
                <FontAwesomeIcon
                  icon={isMobileMenuCateOpen ? faMinus : faPlus}
                />
              </div>
            </button>

            <ul
              className={`submenu-category-list ${
                isMobileMenuCateOpen ? "active" : ""
              }`}
            >
              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Dress & Frock
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Earrings
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Necklace
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Makeup Kit
                </Link>
              </li>
            </ul>
          </li>

          <li className="menu-category">
            <button
              className="accordion-menu"
              data-accordion-btn
              onClick={toggleMobileMenuCate3}
            >
              <p className="menu-title">Jewelry</p>

              <div>
                <FontAwesomeIcon
                  icon={isMobileMenuCateOpen3 ? faMinus : faPlus}
                />
              </div>
            </button>

            <ul
              className={`submenu-category-list ${
                isMobileMenuCateOpen3 ? "active" : ""
              }`}
            >
              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Earrings
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Couple Rings
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Necklace
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Bracelets
                </Link>
              </li>
            </ul>
          </li>

          <li className="menu-category">
            <button
              className="accordion-menu"
              data-accordion-btn
              onClick={toggleMobileMenuCate4}
            >
              <p className="menu-title">Perfume</p>

              <div>
                <FontAwesomeIcon
                  icon={isMobileMenuCateOpen4 ? faMinus : faPlus}
                />
              </div>
            </button>

            <ul
              className={`submenu-category-list ${
                isMobileMenuCateOpen4 ? "active" : ""
              }`}
            >
              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Clothes Perfume
                </Link>
              </li>
              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Deodorant
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Flower Fragrance
                </Link>
              </li>

              <li className="submenu-category">
                <Link to="#" className="submenu-title">
                  Air Freshener
                </Link>
              </li>
            </ul>
          </li>

          <li className="menu-category">
            <Link to="#" className="menu-title">
              Blog
            </Link>
          </li>

          <li className="menu-category">
            <Link to="#" className="menu-title">
              Hot Offers
            </Link>
          </li>
        </ul>

        <div className="menu-bottom">
          <ul className="menu-category-list">
            <li className="menu-category">
              <button
                className="accordion-menu"
                data-accordion-btn
                onClick={toggleMobileMenuCate6}
              >
                <p className="menu-title">Language</p>
                <FontAwesomeIcon
                  icon={isMobileMenuCateOpen6 ? faMinus : faCaretLeft}
                />
              </button>
              <ul
                className={`submenu-category-list ${
                  isMobileMenuCateOpen6 ? "active" : ""
                }`}
              >
                <li className="submenu-category">
                  <Link to="#" className="submenu-title">
                    English
                  </Link>
                </li>

                <li className="submenu-category">
                  <Link to="#" className="submenu-title">
                    Español
                  </Link>
                </li>

                <li className="submenu-category">
                  <Link to="#" className="submenu-title">
                    French
                  </Link>
                </li>
              </ul>
            </li>

            <li className="menu-category">
              <button
                className="accordion-menu"
                data-accordion-btn
                onClick={toggleMobileMenuCate7}
              >
                <p className="menu-title">Currency</p>
                <FontAwesomeIcon
                  icon={isMobileMenuCateOpen7 ? faMinus : faCaretLeft}
                />
              </button>

              <ul
                className={`submenu-category-list ${
                  isMobileMenuCateOpen7 ? "active" : ""
                }`}
              >
                <li className="submenu-category">
                  <Link to="#" className="submenu-title">
                    USD $
                  </Link>
                </li>

                <li className="submenu-category">
                  <Link to="#" className="submenu-title">
                    EUR €
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="menu-social-container">
            <li>
              <Link to="#" className="social-link">
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
            </li>

            <li>
              <Link to="#" className="social-link">
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
            </li>
            <li>
              <Link to="#" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
            </li>

            <li>
              <Link to="#" className="social-link">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;