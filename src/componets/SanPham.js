import React, { useState, useEffect } from "react";
import ProductService from "../services/Productservice";
import { Link } from "react-router-dom";
const urlImage = "http://localhost/NimAnLuc_CDTT/public/";

function SanPham() {
  const [bestseller, setBestseller] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    const fetchBest = async () => {
      try {
        const result = await ProductService.bestseller(4);
        setBestseller(result.products);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trò chơi bán chạy nhất:", error);
      }
    };

    const fetchNew = async () => {
      try {
        const result = await ProductService.new(4);
        setNewProducts(result.products);
        console.log(result)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trò chơi mới:", error);
      }
    };

    const fetchSale = async () => {
      try {
        const result = await ProductService.sale(4);
        setSaleProducts(result.products);
        console.log(result)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trò chơi giảm giá:", error);
      }
    };

    fetchBest();
    fetchNew();
    fetchSale();
  }, []);

  const ProductCard = ({ product }) => (
    <Link to={`/product_detail/${product.slug}`}>
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300">
      <img
        src={urlImage + "images/product/" + product.images[0].thumbnail}
        alt={product.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{product.name}</h3>
        <p className="text-gray-700 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          {product.price_sale ? (
            <>
              <span className="text-red-500 font-bold">{product.price_sale}₫</span>
              <span className="text-gray-500 line-through">{product.price}₫</span>
            </>
          ) : (
            <span className="text-red-500 font-bold">{product.price}₫</span>
          )}
        </div>
      </div>
    </div>
    </Link>
  );
  

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Danh sách trò chơi theo xu hướng</h2>

      {/* Trò chơi bán chạy nhất */}
      {bestseller.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Trò chơi bán chạy nhất</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestseller.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Trò chơi mới */}
      {newProducts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Trò chơi mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Trò chơi giảm giá */}
      {saleProducts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Trò chơi giảm giá</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {saleProducts.map((product) => (

              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SanPham;
