import React from 'react'
import { IoCloseOutline} from "react-icons/io5";

const Notification = () => {
    return (
        <>
            <div className="notification-toast" data-toast>

                <button className="toast-close-btn" data-toast-close>
                    <ion-icon name="close-outline"><IoCloseOutline/></ion-icon>
                </button>

                <div className="toast-banner">
                    <img src={require("../../../assets/images/products/jewellery-1.jpg")} alt="Rose Gold Earrings" width="80" height="70"/>
                </div>

                <div className="toast-detail">

                    <p className="toast-message">
                        Someone in new just bought
                    </p>

                    <p className="toast-title">
                        Rose Gold Earrings
                    </p>

                    <p className="toast-meta">
                        <time datetime="PT2M">2 Minutes</time> ago
                    </p>

                </div>

            </div>

        </>
    )
}

export default Notification