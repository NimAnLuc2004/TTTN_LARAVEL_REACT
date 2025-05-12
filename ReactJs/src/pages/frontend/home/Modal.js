import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            formData: {
                name: '',
                email: '',
                phone: '',
                title: 'Newsletter Subscription', // Giá trị mặc định
                content: 'Interested in receiving updates and offers.', // Giá trị mặc định
            },
            isSubmitting: false,
        };
    }

    handleCloseModal = () => {
        this.setState({ isOpen: false });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            formData: {
                ...prevState.formData,
                [name]: value,
            },
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { formData } = this.state;

        if (!formData.email) {
            toast.error('Vui lòng nhập địa chỉ email hợp lệ.');
            return;
        }

        this.setState({ isSubmitting: true });

        try {
            const response = await fetch('http://127.0.0.1:8000/api/frontend/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Đăng ký thành công! Cảm ơn bạn đã đăng ký.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                this.setState({
                    formData: {
                        name: '',
                        email: '',
                        phone: '',
                        title: 'Newsletter Subscription',
                        content: 'Interested in receiving updates and offers.',
                    },
                    isOpen: false,
                });
            } else {
                toast.error(data.message || 'Đăng ký thất bại. Vui lòng thử lại.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    render() {
        const { isOpen, formData, isSubmitting } = this.state;

        return (
            <>
                <ToastContainer />
                {isOpen && (
                    <div className="modal" data-modal="">
                        <div className="modal-close-overlay" data-modal-overlay="" />
                        <div className="modal-content">
                            <button className="modal-close-btn" onClick={this.handleCloseModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <div className="newsletter-img">
                                <img
                                    src={require('../../../assets/images/newsletter.png')}
                                    alt="đăng ký bản tin"
                                    width={500}
                                    height={500}
                                />
                            </div>
                            <div className="newsletter">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="newsletter-header">
                                        <h3 className="newsletter-title">Đăng ký nhận bản tin</h3>
                                        <p className="newsletter-desc">
                                            Đăng ký nhận bản tin từ <b>Anon</b> để nhận thông tin sản phẩm mới nhất và ưu đãi.
                                        </p>
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        className="input-field"
                                        placeholder="Họ và tên"
                                        value={formData.name}
                                        onChange={this.handleInputChange}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        className="input-field"
                                        placeholder="Địa chỉ email"
                                        value={formData.email}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="input-field"
                                        placeholder="Số điện thoại"
                                        value={formData.phone}
                                        onChange={this.handleInputChange}
                                    />
                                    <button type="submit" className="btn-newsletter" disabled={isSubmitting}>
                                        {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default Modal;