import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true // Ban đầu modal được mở
        };
    }

    handleCloseModal = () => {
        this.setState({ isOpen: false }); // Đặt trạng thái của modal thành closed khi nút close được nhấn
    };

    render() {
        return (
            <>
                {this.state.isOpen && ( // Chỉ hiển thị modal nếu trạng thái là mở
                    <div className="modal" data-modal="">
                        <div className="modal-close-overlay" data-modal-overlay="" />
                        <div className="modal-content">
                            <button className="modal-close-btn" onClick={this.handleCloseModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <div className="newsletter-img">
                                <img
                                    src={require("../../../assets/images/newsletter.png")}
                                    alt="subscribe newsletter"
                                    width={500}
                                    height={500}
                                />
                            </div>
                            <div className="newsletter">
                                <form action="#">
                                    <div className="newsletter-header">
                                        <h3 className="newsletter-title">Subscribe Newsletter.</h3>
                                        <p className="newsletter-desc">
                                            Subscribe the <b>Anon</b> to get latest products and discount update.
                                        </p>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        className="email-field"
                                        placeholder="Email Address"
                                        required=""
                                    />
                                    <button type="submit" className="btn-newsletter">
                                        Subscribe
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