import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Blog = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/frontend/news/list/4?page=${page}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        if (data.status) {
          setNewsList((prev) => [...prev, ...data.news_list]); // Thêm tin tức mới
          setTotalPages(data.total_pages);
        } else {
          throw new Error(data.message);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, [page]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

if (loading && page === 1) {
  return (
    <div className="blog">
      <div className="container">
        <div className="flex items-center justify-center h-64">
          <motion.div
            className="flex space-x-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-600 rounded-full opacity-75"></div>
            <div className="w-4 h-4 bg-gray-600 rounded-full opacity-50"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
  if (error) {
    return (
      <div className="blog">
        <div className="container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  const urlImage = "http://127.0.0.1:8000/images/";
  return (
    <div className="blog">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tin tức mới nhất</h2>
          <Link
            to="/news"
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="blog-container has-scrollbar">
          {newsList.length > 0 ? (
            newsList.map((news, index) => (
              <div className="blog-card" key={index}>
                <Link to={`/news/detail/${news.id}`}>
                  <img
                    src={`${urlImage}new/${JSON.parse(news.image)[0]}`}
                    alt={news.title}
                    className="blog-banner"
                    style={{
                      width: "300px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </Link>
                <div className="blog-content">
                  <Link to={`/news/detail/${news.id}`}>
                    <h3 className="blog-title">{news.title}</h3>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
        {page < totalPages && (
          <div className="text-center mt-6">
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Tải thêm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;