import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Set up Axios defaults for authentication
const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Handle 401 errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve user_id from local storage
  const { id: userId } = JSON.parse(localStorage.getItem('user') || '{}');


  const API_URL = 'http://127.0.0.1:8000/api/frontend';
  const urlImage = 'http://127.0.0.1:8000/images/product/';

  // Check if user is logged in
  useEffect(() => {
    if (!userId || !token) {
      setError('Vui lòng đăng nhập để xem danh sách yêu thích.');
      setLoading(false);
      toast.error('Vui lòng đăng nhập!');
      navigate('/login');
    }
  }, [userId, navigate]);

  // Fetch wishlist
  const fetchWishlist = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/wishlist/${userId}`);
   
      if (response.data.status) {
        setWishlistItems(response.data.wishlist.data);
      } else {
        setError(response.data.message || 'Không thể tải danh sách yêu thích.');
        toast.error(response.data.message || 'Không thể tải danh sách yêu thích.');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách yêu thích. Vui lòng thử lại.');
      toast.error('Lỗi khi tải danh sách yêu thích.');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchWishlist();
  }, [userId]);

  // Remove item from wishlist
  const handleRemoveItem = async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/wishlist`, {
        data: { 
          product_id: productId,
          user_id:userId

        },
      });
      if (response.data.status) {
        setWishlistItems(wishlistItems.filter((item) => item.product_id !== productId));
        toast.success('Đã xóa khỏi danh sách yêu thích!');
      } else {
        toast.error(response.data.message || 'Không thể xóa sản phẩm khỏi danh sách yêu thích.');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Lỗi khi xóa sản phẩm. Vui lòng thử lại.');
    }
  };

  // Calculate sale price
  const calculateSalePrice = (minPrice, discountPercent) => {
    const price = parseFloat(minPrice) || 100;
    if (!discountPercent) {
      return { salePrice: price.toLocaleString(), comparePrice: null, discount: null };
    }
    const salePrice = price * (1 - discountPercent / 100);
    return {
      salePrice: salePrice.toLocaleString(),
      comparePrice: price.toLocaleString(),
      discount: `${discountPercent}%`,
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto p-5 flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-xl animate-pulse">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-5 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <p className="text-red-500">{error}</p>
          {userId && (
            <button
              onClick={fetchWishlist}
              className="mt-4 bg-orange-500 text-white px-5 py-3 rounded-md hover:bg-orange-600 transition"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Danh sách yêu thích</h1>
          <button
            onClick={fetchWishlist}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
          >
            Tải lại danh sách
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg mb-3">
              Danh sách yêu thích của bạn đang trống!
            </p>
            <Link
              to="/category?category_id=all"
              className="inline-block bg-orange-500 text-white px-5 py-3 rounded-md hover:bg-orange-600 transition"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {wishlistItems.map((item) => {
                const { salePrice, comparePrice, discount } = calculateSalePrice(
                  item.product.min_price,
                  item.product.discount_percent
                );
                const imageUrl = item.product.images?.[0]?.image_url
                  ? `${urlImage}${item.product.images[0].image_url}`
                  : 'https://via.placeholder.com/100x100?text=Product';

                return (
                  <div
                    key={item.product_id}
                    className="flex flex-col md:flex-row items-center gap-5 p-5 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/product/${item.product_id}`} className="text-lg font-medium text-gray-800 truncate hover:text-orange-500">
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-orange-500 text-xl font-semibold">
                          {salePrice} ₫
                        </span>
                        {comparePrice && (
                          <span className="text-gray-500 line-through">
                            {comparePrice} ₫
                          </span>
                        )}
                        {discount && (
                          <span className="bg-orange-100 text-orange-500 px-2 py-1 rounded-md text-sm">
                            -{discount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-red-500 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 text-right">
              <p className="text-gray-600">
                Tổng cộng: <span className="font-semibold">{wishlistItems.length} sản phẩm</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;