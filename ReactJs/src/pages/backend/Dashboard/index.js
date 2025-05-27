import React, { useState, useEffect } from "react";
import { XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { FaClock } from "react-icons/fa";
import PaymentService from "../../../services/Paymentservice";
import Orderservice from "../../../services/Orderservice";
import Userservice from "../../../services/Userservice";
import ProductStoreservice from "../../../services/ProductStoreservice";
import Logservice from "../../../services/Logservice";

const Dashboard = () => {
  const [totalStock, setTotalStock] = useState({ message: "", total_quantity: 0 });
  const [totalUser, setTotalUser] = useState({ message: "", total_user: 0 });
  const [totalOrder, setTotalOrderItem] = useState({ message: "", total_orders: 0 });
  const [topRevenueProducts, setTopRevenueProducts] = useState([]);
  const [topMostOrderedProducts, setTopMostOrderedProducts] = useState([]);
  const [totalSold, setTotalSold] = useState({ message: "", total_sold: 0 });
  const [logs, setLogs] = useState([]);
  const [paymentStats, setPaymentStats] = useState({ cod_total: 0, bank_transfer_total: 0 });

  // Màu sắc cho biểu đồ
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    const fetchtotalUser = async () => {
      try {
        const result = await Userservice.totalUser();
        setTotalUser(result || { message: "Tổng người dùng", total_user: 0 });
      } catch (error) {
        console.error("Error fetching total user:", error);
        setTotalUser({ message: "Tổng người dùng", total_user: 0 });
      }
    };

    const fetchtotalOrder = async () => {
      try {
        const result = await Orderservice.totalOrders();
        setTotalOrderItem(result || { message: "Tổng đơn hàng", total_orders: 0 });
      } catch (error) {
        console.error("Error fetching total orders:", error);
        setTotalOrderItem({ message: "Tổng đơn hàng", total_orders: 0 });
      }
    };

    const fetchrevenueProduct = async () => {
      try {
        const result = await Orderservice.topRevenueProducts();
        if (result?.top_products) {
          const formattedData = result.top_products.map((item) => ({
            name: item.name,
            revenue: item.total_revenue,
          }));
          setTopRevenueProducts(formattedData);
          console.log("Top Revenue Products:", formattedData);
        } else {
          setTopRevenueProducts([]);
        }
      } catch (error) {
        console.error("Error fetching top revenue products:", error);
        setTopRevenueProducts([]);
      }
    };

    const fetchmostOrder = async () => {
      try {
        const result = await Orderservice.mostOrderedProduct();
        if (result?.top_product) {
          const formattedData = result.top_product.map((item) => ({
            name: item.name,
            order_count: Number(item.total_quantity), // Chuyển chuỗi thành số
          }));
          setTopMostOrderedProducts(formattedData);
          console.log("Top Most Ordered Products:", formattedData);
        } else {
          setTopMostOrderedProducts([]);
          console.log("No top ordered products data");
        }
      } catch (error) {
        console.error("Error fetching most ordered products:", error);
        setTopMostOrderedProducts([]);
      }
    };

    const fetchproductStock = async () => {
      try {
        const result = await ProductStoreservice.totalProductsInStock();
        setTotalStock(result || { message: "Tổng tồn kho", total_quantity: 0 });
      } catch (error) {
        console.error("Error fetching total stock:", error);
        setTotalStock({ message: "Tổng tồn kho", total_quantity: 0 });
      }
    };

    const fetchproductSold = async () => {
      try {
        const result = await Orderservice.totalProductsSold();
        setTotalSold(result || { message: "Tổng sản phẩm bán", total_sold: 0 });
      } catch (error) {
        console.error("Error fetching total sold:", error);
        setTotalSold({ message: "Tổng sản phẩm bán", total_sold: 0 });
      }
    };

    const fetchLog = async () => {
      try {
        const result = await Logservice.index();
        setLogs(result.data || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLogs([]);
      }
    };

    const fetchPaymentStats = async () => {
      try {
        const result = await PaymentService.getPaymentStats();
        setPaymentStats(result || { cod_total: 0, bank_transfer_total: 0 });
        console.log("Payment Stats:", result);
      } catch (error) {
        console.error("Error fetching payment stats:", error);
        setPaymentStats({ cod_total: 0, bank_transfer_total: 0 });
      }
    };

    fetchLog();
    fetchtotalUser();
    fetchtotalOrder();
    fetchproductStock();
    fetchproductSold();
    fetchrevenueProduct();
    fetchmostOrder();
    fetchPaymentStats();
  }, []);

  // Tùy chỉnh Tooltip cho biểu đồ cột
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 text-lg">{label}</p>
          <p className="text-blue-600 text-base">{`Doanh thu: ${payload[0].value.toLocaleString()} ₫`}</p>
        </div>
      );
    }
    return null;
  };

  // Tùy chỉnh Tooltip cho biểu đồ tròn
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 text-lg">{payload[0].name}</p>
          <p className="text-green-600 text-base">{`Số lượng: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 p-5">
      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
          <p className="text-2xl">{totalStock.message || "Tổng tồn kho"}</p>
          <p className="text-sm">{totalStock.total_quantity || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-teal-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
          <p className="text-2xl">{totalOrder.message || "Tổng đơn hàng"}</p>
          <p className="text-sm">{totalOrder.total_orders || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-pink-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
          <p className="text-2xl">{totalSold.message || "Tổng sản phẩm bán"}</p>
          <p className="text-sm">{totalSold.total_sold || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-yellow-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
          <p className="text-2xl">{totalUser.message || "Tổng người dùng"}</p>
          <p className="text-sm">{totalUser.total_user || 0}</p>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Thống kê thanh toán
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
            <p className="text-2xl">Thanh toán khi nhận hàng (COD)</p>
            <p className="text-sm">{(paymentStats.cod_total || 0).toLocaleString()} ₫</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-4 rounded-xl shadow-xl text-center font-bold text-white">
            <p className="text-2xl">Chuyển khoản ngân hàng</p>
            <p className="text-sm">{(paymentStats.bank_transfer_total || 0).toLocaleString()} ₫</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {/* Biểu đồ cột: Top 5 Sản phẩm có doanh thu cao nhất */}
        <div className="bg-white p-5 rounded-xl shadow-xl text-black">
          <h3 className="text-lg font-semibold mb-3">
            Top 5 Sản phẩm có doanh thu cao nhất
          </h3>
          <BarChart
            width={450}
            height={300}
            data={topRevenueProducts}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomBarTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="revenue"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationDuration={1000}
              label={{ position: "top", formatter: (value) => `${(value / 1000000).toFixed(1)}M`, fill: "#333" }}
            >
              {topRevenueProducts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </div>

        {/* Biểu đồ tròn: Top 5 Sản phẩm được đặt hàng nhiều nhất */}
        <div className="bg-white p-5 rounded-xl shadow-xl text-black">
          <h3 className="text-lg font-semibold mb-3">
            Top 5 Sản phẩm được đặt hàng nhiều nhất
          </h3>
          {console.log("Rendering PieChart, topMostOrderedProducts:", topMostOrderedProducts)}
          {topMostOrderedProducts.length === 0 ? (
            <p className="text-gray-500 text-center italic">Không có dữ liệu để hiển thị</p>
          ) : (
            <PieChart width={450} height={300}>
              <Pie
                data={topMostOrderedProducts}
                dataKey="order_count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {topMostOrderedProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          )}
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
                      Người dùng: <span className="font-medium">{log.user_id}</span>
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