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
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
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
  const fetchWishlist = async (page = 1, perPage = 10) => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/wishlist/${userId}`, {
        params: { page, per_page: perPage },
      });

      if (response.data.status) {
        setWishlistItems(response.data.wishlist.data);
        setPagination({
          current_page: response.data.wishlist.current_page,
          last_page: response.data.wishlist.last_page,
          per_page: response.data.wishlist.per_page,
          total: response.data.wishlist.total,
        });
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

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchWishlist(page, pagination.per_page);
    }
  };

  // Remove item from wishlist
  const handleRemoveItem = async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/wishlist`, {
        data: {
          product_id: productId,
          user_id: userId,
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
      <div className="container mx-auto p-4 sm:p-5 flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg sm:text-xl animate-pulse">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-5 min-h-screen">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
          <p className="text-red-500 text-sm sm:text-base">{error}</p>
          {userId && (
            <button
              onClick={() => fetchWishlist(pagination.current_page, pagination.per_page)}
              className="mt-4 bg-orange-500 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-md hover:bg-orange-600 transition text-sm sm:text-base"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-4 sm:mb-0">
            Danh sách yêu thích
          </h1>
          <button
            onClick={() => fetchWishlist(pagination.current_page, pagination.per_page)}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition text-sm sm:text-base"
          >
            Tải lại danh sách
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-8 sm:py-10">
            <p className="text-gray-500 text-base sm:text-lg mb-3">
              Danh sách yêu thích của bạn đang trống!
            </p>
            <Link
              to="/product/all?category_id="
              className="inline-block bg-orange-500 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-md hover:bg-orange-600 transition text-sm sm:text-base"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 sm:space-y-5">
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
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 p-4 sm:p-5 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                      />
                    </Link>
                    <div className="flex-1 w-full">
                      <Link
                        to={`/product/${item.product_id}`}
                        className="text-base sm:text-lg font-medium text-gray-800 truncate hover:text-orange-500 block"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                        <span className="text-orange-500 text-lg sm:text-xl font-semibold">
                          {salePrice} ₫
                        </span>
                        {comparePrice && (
                          <span className="text-gray-500 line-through text-sm sm:text-base">
                            {comparePrice} ₫
                          </span>
                        )}
                        {discount && (
                          <span className="bg-orange-100 text-orange-500 px-2 py-1 rounded-md text-xs sm:text-sm">
                            -{discount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end w-full sm:w-auto">
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-red-500 hover:underline text-sm sm:text-base p-2"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm sm:text-base">
                Tổng cộng: <span className="font-semibold">{pagination.total} sản phẩm</span>
              </p>
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base min-w-[40px]"
                >
                  Trước
                </button>
                {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md min-w-[40px] text-sm sm:text-base ${
                      pagination.current_page === page
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base min-w-[40px]"
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;