import React, { useState, useEffect } from 'react';
import { IoArrowUndoOutline, IoBoatOutline, IoCallOutline, IoRocketOutline, IoTicketOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Quotes from '../../../assets/images/icons/quotes.svg';

const Testimonial = () => {
    const [review, setReview] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy review
                const reviewResponse = await fetch('http://127.0.0.1:8000/api/frontend/review', {
                    headers: { 'Content-Type': 'application/json' },
                });
                const reviewData = await reviewResponse.json();

                if (reviewData.status) {
                    setReview(reviewData.data);
                } else {
                    toast.error(reviewData.message || 'Failed to load review.');
                }

                // Lấy discount
                const discountResponse = await fetch('http://127.0.0.1:8000/api/frontend/discounts', {
                    headers: { 'Content-Type': 'application/json' },
                });
                const discountData = await discountResponse.json();
                if (discountData.status) {
                    setDiscount(discountData.data);
                } else {
                    console.log(discountData.message || 'Failed to load discount.');
                }
            } catch (error) {
                toast.error('An error occurred while fetching data.');
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
                        <h2 className="title">testimonial</h2>
                        {review && (
                            <div className="testimonial-card">
                                <img
                                    src={review.image_url || require('../../../assets/images/testimonial-1.jpg')}
                                    alt={review.name}
                                    className="testimonial-banner"
                                    width="80"
                                    height="80"
                                />
                                <p className="testimonial-name">{review.name}</p>
                                <p className="testimonial-title">{review.title}</p>
                                <img src={Quotes} alt="quotation" className="quotation-img" width="26" />
                                <p className="testimonial-desc">{review.description}</p>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="cta-container">
                        <img
                            src={discount?.image_url || require('../../../assets/images/cta-banner.jpg')}
                            alt={discount?.title || 'Discount Banner'}
                            className="cta-banner"
                        />
                        <a href="#" className="cta-content">
                            <p className="discount">{discount?.discount || '0%'}</p>
                            <h2 className="cta-title">{discount?.title || 'No Discount Available'}</h2>
                            <p className="cta-text">{discount?.description || 'Check back later for exciting offers!'}</p>
                            <button className="cta-btn">Shop now</button>
                        </a>
                    </div>

                    {/* Services (giữ nguyên dữ liệu tĩnh) */}
                    <div className="service">
                        <h2 className="title">Our Services</h2>
                        <div className="service-container">
                            <a href="#" className="service-item">
                                <div className="service-icon">
                                    <IoBoatOutline />
                                </div>
                                <div className="service-content">
                                    <h3 className="service-title">Worldwide Delivery</h3>
                                    <p className="service-desc">For Order Over $100</p>
                                </div>
                            </a>
                            <a href="#" className="service-item">
                                <div className="service-icon">
                                    <IoRocketOutline />
                                </div>
                                <div className="service-content">
                                    <h3 className="service-title">Next Day delivery</h3>
                                    <p className="service-desc">UK Orders Only</p>
                                </div>
                            </a>
                            <a href="#" className="service-item">
                                <div className="service-icon">
                                    <IoCallOutline />
                                </div>
                                <div className="service-content">
                                    <h3 className="service-title">Best Online Support</h3>
                                    <p className="service-desc">Hours: 8AM - 11PM</p>
                                </div>
                            </a>
                            <a href="#" className="service-item">
                                <div className="service-icon">
                                    <IoArrowUndoOutline />
                                </div>
                                <div className="service-content">
                                    <h3 className="service-title">Return Policy</h3>
                                    <p className="service-desc">Easy & Free Return</p>
                                </div>
                            </a>
                            <a href="#" className="service-item">
                                <div className="service-icon">
                                    <IoTicketOutline />
                                </div>
                                <div className="service-content">
                                    <h3 className="service-title">30% money back</h3>
                                    <p className="service-desc">For Order Over $100</p>
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