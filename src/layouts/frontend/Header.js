import Logo from "../../assets/images/logo/logo.svg"
import { IonIcon } from '@ionic/react';
import { addOutline, caretBackOutline, closeOutline, gridOutline, homeOutline, logoFacebook, removeOutline } from 'ionicons/icons';
import { logoTwitter, logoInstagram, logoLinkedin, searchOutline } from 'ionicons/icons';
import { personOutline, heartOutline, bagHandleOutline, menuOutline } from 'ionicons/icons';


import React, { useState } from 'react';

import { Link } from 'react-router-dom';


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
                <Link href="#" className="social-link">
                  <IonIcon icon={logoFacebook} />
                </Link>
              </li>

              <li>
                <Link href="#" className="social-link">
                  <IonIcon icon={logoTwitter} /> 
                </Link>
              </li>

              <li>
                <Link href="#" className="social-link">
                  <IonIcon icon={logoInstagram} /> 
                </Link>
              </li>

              <li>
                <Link href="#" className="social-link">
                  <IonIcon icon={logoLinkedin} /> 
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
                <option value="eur">EUR &euro;</option>
</select>

              <select name="language">

                <option value="en-US">English</option>
                <option value="es-ES">Espa&ntilde;ol</option>
                <option value="fr">Fran&ccedil;ais</option>

              </select>

            </div>

          </div>

        </div>

        <div className="header-main">

          <div className="container">

            <Link href="#" className="header-logo">
              <img src={Logo} alt="Anon's logo" width="120" height="36" />
            </Link>

            <div className="header-search-container">

              <input type="search" name="search" className="search-field" placeholder="Enter your product name..." />

              <button className="search-btn">
                <IonIcon icon={searchOutline} /> 
              </button>

            </div>

            <div className="header-user-actions">
              <button className="action-btn">
              <IonIcon icon={personOutline} /> 
              </button>
              <button className="action-btn">
                <IonIcon icon={heartOutline} /> 
                <span className="count">0</span>
              </button>
              <button className="action-btn">
                <IonIcon icon={bagHandleOutline} /> 
                <span className="count">0</span>
              </button>
            </div>

          </div>

        </div>

        <nav className="desktop-navigation-menu">

          <div className="container">

            <ul className="desktop-menu-category-list">

              <li className="menu-category">
                <Link href="#" className="menu-title">Home</Link>
              </li>

              <li className="menu-category">
                <Link href="#" className="menu-title">Categories</Link>

                <div className="dropdown-panel">

                  <ul className="dropdown-panel-list">

                    <li className="menu-title">
                      <Link href="#">Electronics</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Desktop</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Laptop</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Camera</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Tablet</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Headphone</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">
                        <img src={require("../../assets/images/electronics-banner-1.jpg")} alt="headphone collection" width="250"
                          height="119" />
                      </Link>
</li>

                  </ul>

                  <ul className="dropdown-panel-list">

                    <li className="menu-title">
                      <Link href="#">Men's</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Formal</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Casual</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Sports</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Jacket</Link>
                    </li>

                    <li className="panel-list-item">
                    <Link href="#">Sunglasses</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">
                        <img src={require("../../assets/images/mens-banner.jpg")} alt="men's fashion" width="250" height="119" />
                      </Link>
                    </li>

                  </ul>

                  <ul className="dropdown-panel-list">

                    <li className="menu-title">
                      <Link href="#">Women's</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Formal</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Casual</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Perfume</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Cosmetics</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Bags</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">
                        <img src={require("../../assets/images/womens-banner.jpg")} alt="women's fashion" width="250" height="119" />
                      </Link>
                    </li>

                  </ul>

                  <ul className="dropdown-panel-list">

                    <li className="menu-title">
                      <Link href="#">Electronics</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Smart Watch</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Smart TV</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Keyboard</Link>
                    </li>

                    <li className="panel-list-item">
<Link href="#">Mouse</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">Microphone</Link>
                    </li>

                    <li className="panel-list-item">
                      <Link href="#">
                        <img src={require("../../assets/images/electronics-banner-2.jpg")} alt="mouse collection" width="250" height="119" />
                      </Link>
                    </li>

                  </ul>

                </div>
              </li>

              <li className="menu-category">
                <Link href="#" className="menu-title">Men's</Link>

                <ul className="dropdown-list">

                  <li className="dropdown-item">
                    <Link href="#">Shirt</Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="#">Shorts & Jeans</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Safety Shoes</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Wallet</Link>
                  </li>

                </ul>
              </li>

              <li className="menu-category">
                <Link href="#" className="menu-title">Women's</Link>

                <ul className="dropdown-list">

                  <li className="dropdown-item">
                    <Link href="#">Dress & Frock</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Earrings</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Necklace</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Makeup Kit</Link>
                  </li>

                </ul>
              </li>

              <li className="menu-category">
                <Link href="#" className="menu-title">Jewelry</Link>

                <ul className="dropdown-list">

                  <li className="dropdown-item">
                    <Link href="#">Earrings</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Couple Rings</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Necklace</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Bracelets</Link>
                  </li>

                </ul>
              </li>

              <li className="menu-category">
                <Link href="#" className="menu-title">Perfume</Link>

                <ul className="dropdown-list">

                  <li className="dropdown-item">
                    <Link href="#">Clothes Perfume</Link>
                  </li>
<li className="dropdown-item">
                    <Link href="#">Deodorant</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Flower Fragrance</Link>
                  </li>

                  <li className="dropdown-item">
                    <Link href="#">Air Freshener</Link>
                  </li>

                </ul>
              </li>

              <li className="menu-category">
                <Link href="#" className="menu-title">Blog</Link>
              </li>

              <li className="menu-category">
                <Link href="#" className="menu-title">Hot Offers</Link>
              </li>

            </ul>

          </div>

        </nav>

        <div className="mobile-bottom-navigation">
        <button className="action-btn" data-mobile-menu-open-btn onClick={toggleMobileMenu}>
          <IonIcon icon={menuOutline} />
        </button>

          <button className="action-btn">
            <IonIcon icon={bagHandleOutline} />
            <span className="count">0</span>
          </button>

          <button className="action-btn">
            <IonIcon icon={homeOutline} />
          </button>

          <button className="action-btn">
            <IonIcon icon={heartOutline} />
            <span className="count">0</span>
          </button>

          <button className="action-btn" data-mobile-menu-open-btn onClick={toggleMobileMenuCate}>
            <IonIcon icon={gridOutline} />
          </button>

        </div>

        <nav className={`mobile-navigation-menu ${isMobileMenuOpen ? 'active' : ''}`} data-mobile-menu>

          <div className="menu-top">
            <h2 className="menu-title">Menu</h2>

            <button className="menu-close-btn" data-mobile-menu-close-btn onClick={toggleMobileMenu}>
            <IonIcon icon={closeOutline} />
          </button>
          </div>

          <ul className="mobile-menu-category-list">

            <li className="menu-category">
              <Link href="#" className="menu-title">Home</Link>
            </li>

            <li className="menu-category">

              <button className="accordion-menu" data-accordion-btn onClick={toggleMobileMenuCate2}>
                <p className="menu-title">Men's</p>

                <div>
                  <IonIcon icon={isMobileMenuCateOpen2 ? removeOutline : addOutline} />
                </div>
              </button>

              <ul className={`submenu-category-list ${isMobileMenuCateOpen2 ? 'active' : ''}`}>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Shirt</Link>
                </li>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Shorts & Jeans</Link>
                </li>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Safety Shoes</Link>
                </li>
<li className="submenu-category">
                  <Link href="#" className="submenu-title">Wallet</Link>
                </li>

              </ul>

            </li>

            <li className="menu-category">

              <button className="accordion-menu" data-accordion-btn onClick={toggleMobileMenuCate}>
                <p className="menu-title">Women's</p>

                <div>
                <IonIcon icon={isMobileMenuCateOpen ? removeOutline : addOutline} />
                </div>
              </button>

              <ul className={`submenu-category-list ${isMobileMenuCateOpen ? 'active' : ''}`}>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Dress & Frock</Link>
                </li>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Earrings</Link>
                </li>

                <li className="submenu-category">
                <Link href="#" className="submenu-title">Necklace</Link>
                </li>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Makeup Kit</Link>
                </li>

              </ul>

            </li>

            <li className="menu-category">

              <button className="accordion-menu" data-accordion-btn onClick={toggleMobileMenuCate3}>
                <p className="menu-title">Jewelry</p>

                <div>
                <IonIcon icon={isMobileMenuCateOpen3 ? removeOutline : addOutline} />
                </div>
              </button>

              <ul className={`submenu-category-list ${isMobileMenuCateOpen3 ? 'active' : ''}`}>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Earrings</Link>
                </li>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Couple Rings</Link>
                </li>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Necklace</Link>
                </li>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Bracelets</Link>
                </li>

              </ul>

            </li>

            <li className="menu-category">

              <button className="accordion-menu" data-accordion-btn onClick={toggleMobileMenuCate4}>
                <p className="menu-title">Perfume</p>

                <div>
                <IonIcon icon={isMobileMenuCateOpen4 ? removeOutline : addOutline} />
                </div>
              </button>

              <ul className={`submenu-category-list ${isMobileMenuCateOpen4 ? 'active' : ''}`}>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Clothes Perfume</Link>
                </li>
<li className="submenu-category">
                  <Link href="#" className="submenu-title">Deodorant</Link>
                </li>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Flower Fragrance</Link>
                </li>

                <li className="submenu-category">
                  <Link href="#" className="submenu-title">Air Freshener</Link>
                </li>

              </ul>

            </li>

            <li className="menu-category">
              <Link href="#" className="menu-title">Blog</Link>
            </li>

            <li className="menu-category">
              <Link href="#" className="menu-title">Hot Offers</Link>
            </li>

          </ul>

          <div className="menu-bottom">

            <ul className="menu-category-list">

              <li className="menu-category">

                <button className="accordion-menu" data-accordion-btn onClick={toggleMobileMenuCate6}>
                  <p className="menu-title">Language</p>
                  <IonIcon icon={isMobileMenuCateOpen6 ? removeOutline : caretBackOutline} />
               
                </button>
                <ul className={`submenu-category-list ${isMobileMenuCateOpen6 ? 'active' : ''}`}>

                  <li className="submenu-category">
                    <Link href="#" className="submenu-title">English</Link>
                  </li>

                  <li className="submenu-category">
                    <Link href="#" className="submenu-title">Espa&ntilde;ol</Link>
                  </li>

                  <li className="submenu-category">
                    <Link href="#" className="submenu-title">Fren&ccedil;h</Link>
                  </li>

                </ul>

              </li>

              <li className="menu-category">
                <button className="accordion-menu" data-accordion-btn onClick={toggleMobileMenuCate7}>
                  <p className="menu-title">Currency</p>
                  <IonIcon icon={isMobileMenuCateOpen7 ? removeOutline : caretBackOutline} />
                </button>

                <ul className={`submenu-category-list ${isMobileMenuCateOpen7 ? 'active' : ''}`}>
                  <li className="submenu-category">
                    <Link href="#" className="submenu-title">USD &dollar;</Link>
                  </li>

                  <li className="submenu-category">
                    <Link href="#" className="submenu-title">EUR &euro;</Link>
                  </li>
                </ul>
              </li>

            </ul>

            <ul className="menu-social-container">

              <li>
                <Link href="#" className="social-link">
                  <IonIcon icon={logoFacebook} />
                </Link>
              </li>

              <li>
                <Link href="#" className="social-link">
                  <IonIcon icon={logoTwitter} />
                </Link>
              </li>
<li>
                <Link href="#" className="social-link">
                  <IonIcon icon={logoInstagram} />
                </Link>
              </li>

              <li>
                <Link href="#" className="social-link">
                  <IonIcon icon={logoLinkedin} />
                </Link>
              </li>

            </ul>

          </div>

        </nav>
 
      
      


      
      </header>
    )
  }

export default Header;