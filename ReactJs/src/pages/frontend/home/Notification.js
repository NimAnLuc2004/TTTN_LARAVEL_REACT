import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const Notification = () => {
    const [show, setShow] = useState(true);
    const [orderItem, setOrderItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentOrderItem = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/frontend/recent-order-item', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
   

                if (response.ok && data.status) {
                    setOrderItem(data.data);
                } else {
                    toast.error(data.message || 'Failed to load recent order item.', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                    setShow(false); // Ẩn notification nếu không có dữ liệu
                }
            } catch (error) {
                toast.error('An error occurred while fetching recent order item.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setShow(false);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentOrderItem();
    }, []);

    const handleClose = () => {
        setShow(false);
    };

    if (!show || !orderItem) return null;

    return (
        <div className="notification-toast" data-toast>
            <button className="toast-close-btn" onClick={handleClose}>
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="toast-banner">
                <img
                    src={orderItem.image_url || require('../../../assets/images/products/jewellery-1.jpg')}
                    alt={orderItem.product_name}
                    width="80"
                    height="70"
                />
            </div>

            <div className="toast-detail">
                <p className="toast-message">Someone just bought</p>
                <p className="toast-title">{orderItem.product_name}</p>
                <p className="toast-meta">
                    <time dateTime={orderItem.time_ago}>{orderItem.time_ago}</time>
                </p>
            </div>
        </div>
    );
};

export default Notification;