import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Search = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const urlImage = "http://127.0.0.1:8000/images/";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/frontend/product_search?query=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        Search Results for "{query || "All Products"}"
      </h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found for "{query}"</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product) => {
            // Parse average_rating to a number, default to null if invalid
            const rating = product.average_rating
              ? parseFloat(product.average_rating)
              : null;

            return (
              <motion.div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                variants={cardVariants}
                whileHover="hover"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={
                      product.images?.[0]?.image_url
                        ? `${urlImage}product/${product.images[0].image_url}`
                        : "/placeholder.jpg"
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                    <p className="text-gray-600">${product.min_price}</p>
                    <div className="flex items-center mt-2">
                      {rating ? (
                        <>
                          <span className="text-yellow-400">
                            {"★".repeat(Math.round(rating))}
                            {"☆".repeat(5 - Math.round(rating))}
                          </span>
                          <span className="ml-2 text-gray-600 text-sm">
                            ({rating.toFixed(1)})
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-600 text-sm">No rating</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Search;