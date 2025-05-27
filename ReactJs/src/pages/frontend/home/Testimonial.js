import React, { useState, useEffect } from "react";
import {
  IoArrowUndoOutline,
  IoBoatOutline,
  IoCallOutline,
  IoRocketOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import Quotes from "../../../assets/images/icons/quotes.svg";
const token = (localStorage.getItem("token") || "").replace(/^"|"$/g, "");
const Testimonial = () => {
  const [review, setReview] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy review
        const reviewResponse = await fetch(
          "http://127.0.0.1:8000/api/frontend/review",
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const reviewData = await reviewResponse.json();
        if (reviewData.status) {
          setReview(reviewData.data);
        } else {
          toast.error(reviewData.message || "Failed to load review.");
        }

        // Lấy discounts
        const discountResponse = await fetch(
          "http://127.0.0.1:8000/api/frontend/discount",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const discountData = await discountResponse.json();

        if (discountData.status && discountData.data.length > 0) {
          // Sắp xếp theo valid_until nhỏ nhất
          const sortedDiscounts = discountData.data.sort((a, b) => {
            if (!a.valid_until) return 1; // null xếp cuối
            if (!b.valid_until) return -1;
            return new Date(a.valid_until) - new Date(b.valid_until); // Ngày nhỏ nhất trước
          });

          // Lấy mã đầu tiên và định dạng
          const firstDiscount = sortedDiscounts[0];
          setDiscount({
            title: "Special Offer",
            description: `Use code ${firstDiscount.code}, valid until ${
              firstDiscount.valid_until || "Không thời hạn"
            }`,
            discount: `${parseFloat(firstDiscount.discount_percent)}% Discount`,
            image_url: null, // Hoặc firstDiscount.image_url nếu API trả về
          });
        } else {
          setDiscount(null); // Đặt null để hiển thị giá trị mặc định
        }
      } catch (error) {
        console.error("Error fetching data:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="container">
        <div className="testimonials-box">
          {/* Testimonial */}
          <div className="testimonial">
            <h2 className="title">Đánh giá</h2>
            {review && (
              <div className="testimonial-card">
                <img
                  src={
                    review.image_url ||
                    require("../../../assets/images/testimonial-1.jpg")
                  }
                  alt={review.name}
                  className="testimonial-banner"
                  width="80"
                  height="80"
                />
                <p className="testimonial-name">{review.name}</p>
                <p className="testimonial-title">{review.title}</p>
                <img
                  src={Quotes}
                  alt="quotation"
                  className="quotation-img"
                  width="26"
                />
                <p className="testimonial-desc">{review.description}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="cta-container">
            <img
              src={
                discount?.image_url ||
                require("../../../assets/images/cta-banner.jpg")
              }
              alt={discount?.title || "Discount Banner"}
              className="cta-banner"
            />
            <a href="#" className="cta-content">
              <p className="discount">{discount?.discount || "0%"}</p>
              <h2 className="cta-title">
                {discount?.title || "No Discount Available"}
              </h2>
              <p className="cta-text">
                {discount?.description ||
                  "Check back later for exciting offers!"}
              </p>
              <button className="cta-btn">Mua sắm ngay</button>
            </a>
          </div>

          {/* Services */}
          <div className="service">
            <h2 className="title">Dịch vụ của chúng tôi</h2>
            <div className="service-container">
              <a href="#" className="service-item">
                <div className="service-icon">
                  <IoBoatOutline />
                </div>
                <div className="service-content">
                  <h3 className="service-title">Giao hàng toàn cầu</h3>
                  <p className="service-desc">Cho đơn hàng trên $100</p>
                </div>
              </a>
              <a href="#" className="service-item">
                <div className="service-icon">
                  <IoRocketOutline />
                </div>
                <div className="service-content">
                  <h3 className="service-title">Giao hàng ngày hôm sau</h3>
                  <p className="service-desc">
                    Chỉ áp dụng cho đơn hàng tại UK
                  </p>
                </div>
              </a>
              <a href="#" className="service-item">
                <div className="service-icon">
                  <IoCallOutline />
                </div>
                <div className="service-content">
                  <h3 className="service-title">Hỗ trợ trực tuyến tốt nhất</h3>
                  <p className="service-desc">Giờ: 8AM - 11PM</p>
                </div>
              </a>
              <a href="#" className="service-item">
                <div className="service-icon">
                  <IoArrowUndoOutline />
                </div>
                <div className="service-content">
                  <h3 className="service-title">Chính sách đổi trả</h3>
                  <p className="service-desc">Dễ dàng & Miễn phí</p>
                </div>
              </a>
              <a href="#" className="service-item">
                <div className="service-icon">
                  <IoTicketOutline />
                </div>
                <div className="service-content">
                  <h3 className="service-title">Hoàn tiền 30%</h3>
                  <p className="service-desc">Cho đơn hàng trên $100</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
