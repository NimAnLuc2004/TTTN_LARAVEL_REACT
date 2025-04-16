import React, { useState, useEffect } from "react";
import {

  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,

} from "recharts";
import { FaClock } from "react-icons/fa";

import Orderservice from "../../../services/Orderservice";
import Userservice from "../../../services/Userservice";
import ProductStoreservice from "../../../services/ProductStoreservice";
import Logservice from "../../../services/Logservice";

const Dashboard = () => {
  const [totalStock, setTotalStock] = useState("");
  const [totalUser, setTotalUser] = useState("");
  const [totalOrder, setTotalOrderItem] = useState("");
  const [topRevenueProducts, setTopRevenueProducts] = useState([]);
  const [topMostOrderedProducts, setTopMostOrderedProducts] = useState([]);
  const [totalSold, setTotalSold] = useState("");
  const [logs, setLogs] = useState("");
  useEffect(() => {
    const fetchtotalUser = async () => {
      const result = await Userservice.totalUser();
      setTotalUser(result);
      console.log(result);
    };

    const fetchtotalOrder = async () => {
      const result = await Orderservice.totalOrders();
      setTotalOrderItem(result);
      console.log(result);
    };

    const fetchrevenueProduct = async () => {
      const result = await Orderservice.topRevenueProducts();
      console.log(result)
      if (result?.top_products) {
        const formattedData = result.top_products.map((item) => ({
          name: item.name,
          revenue: item.total_revenue,
        }));
        setTopRevenueProducts(formattedData);
        console.log(formattedData)
      }
    };

    const fetchmostOrder = async () => {
      const result = await Orderservice.mostOrderedProduct();
      if (result?.top_product) {
        const formattedData = result.top_product.map((item) => ({
          name: item.name,
          order_count: item.total_quantity,
        }));
        setTopMostOrderedProducts(formattedData);
      }
    };

    const fetchproductStock = async () => {
      const result = await ProductStoreservice.totalProductsInStock();
      setTotalStock(result);
      console.log(result);
    };
    const fetchproductSold = async () => {
      const result = await Orderservice.totalProductsSold();
      setTotalSold(result);
      console.log(result);
    };
    const fetchLog = async () => {
      const result = await Logservice.index();
      setLogs(result.data);
      console.log(result.data);
    };
    fetchLog();
    fetchtotalUser();
    fetchtotalOrder();
    fetchproductStock();
    fetchproductSold();
    fetchrevenueProduct();
    fetchmostOrder();
  }, []);


  return (
    <div className="flex-1 p-5">
      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
          <p className="text-2xl">{totalStock.message}</p>
          <p className="text-sm">{totalStock.total_quantity}</p>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-teal-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
          <p className="text-2xl">{totalOrder.message}</p>
          <p className="text-sm">{totalOrder.total_orders}</p>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-pink-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
          <p className="text-2xl">{totalSold.message}</p>
          <p className="text-sm">{totalSold.total_sold}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-yellow-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
          <p className="text-2xl">{totalUser.message}</p>
          <p className="text-sm">{totalUser.total_user}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {/* Biểu đồ top 5 sản phẩm doanh thu cao nhất */}
        <div className="bg-white p-5 rounded-xl shadow-xl text-black">
          <h3 className="text-lg font-semibold mb-3">
            Top 5 Sản phẩm có doanh thu cao nhất
          </h3>
          <BarChart width={400} height={250} data={topRevenueProducts}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Biểu đồ top 5 sản phẩm được đặt hàng nhiều nhất */}
        <div className="bg-white p-5 rounded-xl shadow-xl text-black">
          <h3 className="text-lg font-semibold mb-3">
            Top 5 Sản phẩm được đặt hàng nhiều nhất
          </h3>
          <BarChart width={400} height={250} data={topMostOrderedProducts}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="order_count" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      {/* Log */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Hoạt động gần đây
        </h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center italic">Không có dữ liệu</p>
        ) : (
          <ul className="space-y-5">
           {logs.slice(0, 5).map((log) => {
              const time =
                log.action === "created"
                  ? new Date(log.created_at).toLocaleString()
                  : new Date(log.updated_at).toLocaleString();

              return (
                <li
                  key={log.id}
                  className="flex items-start space-x-4 bg-gray-50 p-4 rounded-xl"
                >
                  <div className="mt-1 text-blue-500">
                    <FaClock size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">{time}</div>
                    <div className="text-lg font-semibold text-gray-800 capitalize">
                      {log.action}
                    </div>
                    <div className="text-gray-700">{log.description}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Người dùng:{" "}
                      <span className="font-medium">{log.user_id}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
