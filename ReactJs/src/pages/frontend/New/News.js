import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const urlImage = 'http://127.0.0.1:8000/images/new/';

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [featuredNews, setFeaturedNews] = useState(null);

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/frontend/news/topics');
        const data = await response.json();

        if (!response.ok || !data.status) {
          throw new Error(data.message || 'Không thể tải danh mục');
        }

        const uniqueTopics = data.topics.filter((topic) => topic.name !== 'Tất cả');
        setCategories([{ id: null, name: 'Tất cả' }, ...uniqueTopics]);
      } catch (err) {
        setError(err.message || 'Không thể tải danh mục');
      }
    };

    fetchCategories();
  }, []);

  // Lấy danh sách tin tức
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError('');

        let url;
        if (!selectedTopicId) {
          url = `http://127.0.0.1:8000/api/frontend/news/list/${limit}`;
        } else {
          url = `http://127.0.0.1:8000/api/frontend/news/topic/${limit}/${selectedTopicId}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.status) {
          throw new Error(data.message || 'Không thể tải danh sách tin tức');
        }

        const formatImageUrl = (image) => {
          if (!image) return 'https://via.placeholder.com/300x200?text=Tin+Tuc';
          
          try {
            const images = typeof image === 'string' && image.startsWith('[')
              ? JSON.parse(image)
              : image;

            if (Array.isArray(images) && images.length > 0) {
              return `${urlImage}${images[0]}`;
            } else if (typeof images === 'string') {
              return `${urlImage}${images}`;
            }
          } catch (e) {
            console.error('Lỗi phân tích image:', e);
          }
          return 'https://via.placeholder.com/300x200?text=Tin+Tuc';
        };

        const formattedNews = data.news_list.map((news) => ({
          id: news.id,
          title: news.title,
          image: formatImageUrl(news.image),
          description: news.content ? news.content.substring(0, 100) + '...' : news.title,
          created_at: news.created_at
            ? new Date(news.created_at).toLocaleDateString()
            : 'Không rõ ngày',
          category: news.topic?.name || 'Không xác định',
        }));

        // Nếu là danh mục "Tất cả" và chưa có featured news
        if (!selectedTopicId && formattedNews.length > 0 && !featuredNews) {
          setFeaturedNews(formattedNews[0]);
          setNewsList(formattedNews.slice(1));
        } else {
          setNewsList(formattedNews);
        }

        setHasMore(data.news_list.length === limit);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchNews();
    }
  }, [selectedTopicId, limit, categories, featuredNews]);

  const handleCategoryChange = (topicId, name) => {
    setSelectedTopicId(topicId);
    setSelectedCategory(name);
    setLimit(10);
    setNewsList([]);
    setFeaturedNews(null); // Reset featured news khi đổi danh mục
  };

  const handleLoadMore = () => {
    setLimit((prev) => prev + 9);
  };

  const newsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
  };

  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Tin tức</h1>

        {error && (
          <div className="mb-5 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        {loading && <p className="text-center text-gray-600">Đang tải...</p>}

        {!loading && categories.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xl font-semibold mb-3 text-orange-500">Lọc theo danh mục</h2>
            <div className="flex gap-3 flex-wrap">
              {categories.map((category) => (
                <motion.button
                  key={category.id || 'all'}
                  onClick={() => handleCategoryChange(category.id, category.name)}
                  className={`px-4 py-2 rounded-md border transition ${
                    selectedCategory === category.name
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Featured news (chỉ hiển thị khi chọn "Tất cả") */}
        {!loading && featuredNews && !selectedTopicId && (
          <div className="mb-8">
            <Link to={`/news/detail/${featuredNews.id}`}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{featuredNews.title}</h3>
                  <p className="text-gray-600 mb-3">{featuredNews.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ngày đăng: {featuredNews.created_at}</span>
                    <span className="text-orange-500">Danh mục: {featuredNews.category}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        )}

        {/* Danh sách tin tức */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {newsList.map((news, index) => (
              <Link to={`/news/detail/${news.id}`} key={news.id}>
                <motion.div
                  custom={index}
                  variants={newsVariants}
                  initial="hidden"
                  animate="visible"
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-medium text-gray-800 truncate">{news.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{news.description}</p>
                  <p className="text-gray-500 text-sm mt-2">Ngày đăng: {news.created_at}</p>
                  <p className="text-orange-500 text-sm mt-1">Danh mục: {news.category}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {!loading && newsList.length === 0 && (
          <p className="text-center text-gray-500 mt-5">
            Không có tin tức nào trong danh mục này!
          </p>
        )}

        {!loading && newsList.length > 0 && hasMore && (
          <div className="text-center mt-8">
            <motion.button
              onClick={handleLoadMore}
              className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Xem thêm
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;