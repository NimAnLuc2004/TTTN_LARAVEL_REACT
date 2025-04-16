import React, { useEffect, useState } from "react";
import PostService from "../services/Postservice";
import { Link } from "react-router-dom";
import ProductService from "../services/Productservice";

const urlImage = "http://localhost/NimAnLuc_CDTT/public/";

const InfoSection = () => {
  const [posts, setPosts] = useState([]);
  const [bestseller, setBestseller] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await PostService.new(3);

        setPosts(result.posts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      }
    };

    const fetchBest = async () => {
      try {
        const result = await ProductService.bestseller(1);
        setBestseller(result.products);
        console.log(result.products)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchBest();
    fetchPosts();
  }, []);
  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
  };
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Lưới tính năng */}
      {bestseller.length > 0 ? (
        bestseller.map((best) => (
          <div
            key={best.id}
            className="bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg p-8 shadow-md flex flex-col sm:flex-row items-center mb-12"
          >


            <div className="sm:w-1/3 mb-6 sm:mb-0">
            <h3 className="text-3xl font-bold mb-4">Trò chơi bán chạy nhất</h3>
              <img
                src={urlImage + "images/product/" + best.images[0].thumbnail}
                alt={best.name}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="sm:w-2/3 sm:pl-8">
              <h2 className="text-2xl font-bold mb-4">{best.name}</h2>
              <p className="mb-6">{best.description}</p>
              <p className="mb-6">{best.contet}</p>
              <div
              className="product-content text-gray-800"
              dangerouslySetInnerHTML={{ __html: truncateContent(best.content, 100) }}
            />
              <Link to={`product_detail/${best.slug}`}>
                <button className="bg-white text-blue-500 font-bold px-6 py-3 rounded-lg">
                  Tham gia ngay
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center"></p>
      )}

      {/* Thẻ tin tức */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Tin Tức và Sự Kiện
          <Link to={`post_new`} className="ml-3 text-3xl text-orange-500">
            <i class="fa-solid fa-circle-arrow-right"></i>
          </Link>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} to={`post_detail/${post.slug}`}>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <img
                    src={
                      urlImage +
                      "thumbnail/post/" +
                      JSON.parse(post.thumbnail)[0]
                    }
                    alt={post.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{post.title}</h3>
                    <p className="text-gray-500">{post.description}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center">Đang tải tin tức...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
