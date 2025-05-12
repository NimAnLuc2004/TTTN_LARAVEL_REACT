import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);

  // Lấy thông tin user và token từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let token = localStorage.getItem("token");

    // Loại bỏ dấu ngoặc kép thừa nếu có
    if (token) {
      token = token.replace(/^"|"$/g, "");
      localStorage.setItem("token", token);
    }

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Lỗi khi parse user từ localStorage:", e);
        setError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      }
    } else {
      setError("Vui lòng đăng nhập để sử dụng tính năng bình luận.");
    }
  }, []);

  // Lấy dữ liệu tin tức và bình luận
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError("");

        // Gọi API new_detail
        const response = await fetch(
          `http://127.0.0.1:8000/api/frontend/news/detail/${id}`
        );
        const data = await response.json();

        if (!response.ok || !data.status) {
          throw new Error(data.message || "Không thể tải chi tiết tin tức");
        }

        // Xử lý hình ảnh
        const processImages = (imageData) => {
          try {
            if (typeof imageData === "string" && imageData.startsWith("[")) {
              return JSON.parse(imageData);
            }
            return imageData ? [imageData] : [];
          } catch (e) {
            console.error("Lỗi xử lý ảnh:", e);
            return [];
          }
        };

        const newsData = {
          ...data.news,
          images: processImages(data.news.image),
        };

        setNews(newsData);
        setImages(newsData.images);

        // Gọi API lấy bình luận
        const commentsResponse = await fetch(
          `http://127.0.0.1:8000/api/frontend/news/comments/${id}`
        );
        const commentsData = await commentsResponse.json();

        if (commentsResponse.ok && commentsData.status) {
          setComments(commentsData.comments);
        }

        // Gọi API lấy tin tức liên quan
        const relatedResponse = await fetch(
          `http://127.0.0.1:8000/api/frontend/news/topic/3/${data.news.topic.id}`
        );
        const relatedData = await relatedResponse.json();

        if (relatedResponse.ok && relatedData.status) {
          setRelatedNews(
            relatedData.news_list
              .filter((item) => item.id !== parseInt(id))
              .map((item) => ({
                ...item,
                images: processImages(item.image),
              }))
          );
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  // Xử lý thêm bình luận
  const handleAddComment = async () => {
    if (!user || !localStorage.getItem("token")) {
      setError("Vui lòng đăng nhập để bình luận.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/frontend/news/comment/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        if (response.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
        throw new Error(data.message || "Không thể thêm bình luận");
      }

      // Thêm bình luận mới vào danh sách
      setComments([
        {
          id: data.comment.id,
          user_id: user.id,
          user_name: user.name || "Bạn",
          comment: newComment,
          created_at: data.comment.created_at,
          updated_at: data.comment.updated_at,
          reactions: data.comment.reactions || {},
        },
        ...comments,
      ]);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Xử lý reaction cho bình luận
  const handleReaction = async (commentId, reaction) => {
    if (!user || !localStorage.getItem("token")) {
      setError("Vui lòng đăng nhập để thêm reaction.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/frontend/news/comment/${commentId}/reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reaction }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        if (response.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
        throw new Error(data.message || "Không thể thêm reaction");
      }

      // Cập nhật reactions và updated_at trong danh sách bình luận
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              reactions: data.reactions,
              updated_at: data.comment.updated_at,
            };
          }
          return comment;
        })
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Animation
  const detailVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const relatedVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
  };

  if (loading) {
    return <div className="text-center py-5">Đang tải...</div>;
  }

  if (error && !news) {
    return (
      <div className="text-center py-5">
        <h1 className="text-2xl mb-3 text-red-500">
          {error || "Không tìm thấy bài tin tức"}
        </h1>
        <Link to="/news" className="text-blue-500">
          Quay lại danh sách tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <motion.div variants={detailVariants} initial="hidden" animate="visible">
        {/* Phần tiêu đề và thông tin */}
        <h1 className="text-3xl font-bold mb-2">{news?.title}</h1>
        <p className="text-gray-600 mb-4">
          {news?.created_at && new Date(news.created_at).toLocaleDateString()} |{" "}
          {news?.topic?.name || "Không có danh mục"}
        </p>

        {/* Carousel hiển thị nhiều ảnh */}
        {images.length > 0 && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-md">
            <Carousel
              showThumbs={images.length > 1}
              showStatus={false}
              infiniteLoop
              autoPlay
              interval={5000}
              stopOnHover
            >
              {images.map((img, index) => (
                <div key={index} className="h-[1500px]">
                  <img
                    src={`http://127.0.0.1:8000/images/new/${img}`}
                    alt={`${news?.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Nội dung bài viết */}
        <div
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: news?.content }}
        />

        {/* Phần bình luận */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-bold mb-4">
            Bình luận ({comments.length})
          </h2>

          {/* Form bình luận */}
          {user && localStorage.getItem("token") ? (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">
                Đang bình luận với tư cách: {user.name}
              </p>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Viết bình luận của bạn..."
                rows="3"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  disabled={!newComment.trim()}
                >
                  Gửi bình luận
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">
                Vui lòng{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  đăng nhập
                </Link>{" "}
                để bình luận.
              </p>
            </div>
          )}

          {/* Danh sách bình luận */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold">{comment.user_name}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(comment.created_at).toLocaleString()}
                        {comment.created_at !== comment.updated_at && (
                          <span className="ml-2 text-gray-400">
                            (Đã chỉnh sửa:{" "}
                            {new Date(comment.updated_at).toLocaleString()})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {["like", "dislike"].map((reaction) => (
                        <button
                          key={reaction}
                          onClick={() => handleReaction(comment.id, reaction)}
                          className="text-lg hover:scale-125 transition-transform"
                          title={reaction}
                          disabled={!user || !localStorage.getItem("token")}
                        >
                          {getReactionEmoji(reaction)}
                          <span className="text-xs ml-1">
                            {comment.reactions?.[reaction] || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
              </div>
            )}
          </div>
        </div>

        {/* Tin tức liên quan */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Tin tức liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((related, index) => (
                <Link to={`/news/detail/${related.id}`} key={related.id}>
                  <motion.div
                    custom={index}
                    variants={relatedVariants}
                    initial="hidden"
                    animate="visible"
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-transform duration-300 hover:scale-105"
                    style={{ transformOrigin: "center" }}
                  >
                    {related.images.length > 0 ? (
                      <img
                        src={`http://127.0.0.1:8000/images/new/${related.images[0]}`}
                        alt={related.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Không có ảnh</span>
                      </div>
                    )}
                    <div className="p-4 flex-grow">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {related.description ||
                          related.content?.substring(0, 150) ||
                          ""}
                      </p>
                    </div>
                    <div className="px-4 pb-4 text-sm text-gray-500">
                      {new Date(related.created_at).toLocaleDateString()}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

function getReactionEmoji(reaction) {
  const emojis = {
    like: "👍",
    dislike: "👎",
  };
  return emojis[reaction] || "👍";
}

export default NewsDetail;
