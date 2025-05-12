// import { Link, Outlet } from "react-router-dom";
// import {
//   IoMdArrowDroprightCircle,
//   IoMdArrowDropdownCircle,
//   IoMdLogOut,
// } from "react-icons/io";
// import { FiAlignLeft, FiAlignJustify } from "react-icons/fi";
// import React, { useState, useEffect } from "react";
// import {
//   FaBell,
//   FaUser,
//   FaBox,
//   FaRegNewspaper,
//   FaBars,
//   FaUserFriends,
//   FaTag,
//   FaDownload,
//   FaUpload,
// } from "react-icons/fa";

// const LayoutBackend = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [isProductOpen, setProductOpen] = useState(false);
//   const [isProductDown, setProductDown] = useState(false);
//   const [isTopicOpen, setTopicOpen] = useState(false);
//   const [isTopicDown, setTopicDown] = useState(false);
//   const [isMenuOpen, setMenuOpen] = useState(false);
//   const [isMenuDown, setMenuDown] = useState(false);
//   const [isUserOpen, setUserOpen] = useState(false);
//   const [isUserDown, setUserDown] = useState(false);


//   const toggleProduct = () => {
//     setProductOpen(!isProductOpen);
//     setProductDown(!isProductDown);
//   };

//   const toggleTopic = () => {
//     setTopicOpen(!isTopicOpen);
//     setTopicDown(!isTopicDown);
//   };

//   const toggleMenu = () => {
//     setMenuOpen(!isMenuOpen);
//     setMenuDown(!isMenuDown);
//   };

//   const toggleUser = () => {
//     setUserOpen(!isUserOpen);
//     setUserDown(!isUserDown);
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };
//   const userString = localStorage.getItem("user");
//   const user =
//     userString && userString !== "undefined" ? JSON.parse(userString) : null;
//   const urlImage = "http://localhost/NimAnLuc_CDTT/public/";
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     window.location.reload();
//   };
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       <div className="flex flex-grow">
//         {isSidebarOpen && (
//           <aside className="w-64 bg-gray-800 text-white text-center basis-2/12">
//             <div className="p-4 text-center">
//               <div className=" px-2 py-3 border-y-2 border-gray-600">
//                 <Link to={"/admin"} className=" flex flex-row">
//                   <img
//                     className="w-11 h-11 rounded-full"
//                     src={
//                       urlImage +
//                       "thumbnail/user/" +
//                       JSON.parse(user.thumbnail)[0]
//                     }
//                   />
//                   <div className="px-6 py-4 hover:text-sky-500 text-xl font-serif">
//                     {user.name}
//                   </div>
//                 </Link>
//               </div>
//               <div className="flex flex-col items-center justify-center py-6 border-y-2 border-gray-600">
//                 <img
//                   className="w-24 h-24 rounded-full border-4 border-stone-50"
//                   src={
//                     urlImage + "thumbnail/user/" + JSON.parse(user.thumbnail)[0]
//                   }
//                   alt={user.name}
//                 />
//                 <p className="mt-4 text-xl font-serif ">{user.fullname}</p>
//               </div>
//             </div>
//             <nav className="mt-4">
//               <ul className="font-medium">
//                 <li
//                   className="p-3 text-white text-xl cursor-pointer"
//                   onClick={toggleProduct}
//                 >
//                   <div className="flex justify-between hover:bg-gray-400 items-center">
//                     <FaBox className="mr-2" />
//                     <span>Sản phẩm</span>
//                     {isProductDown ? (
//                       <IoMdArrowDropdownCircle className="inline" />
//                     ) : (
//                       <IoMdArrowDroprightCircle className="inline" />
//                     )}
//                   </div>
//                   {isProductOpen && (
//                     <ul className="ml-4 mt-2 space-y-2">
//                       <Link to={"/admin/product"}>
//                         <li className="text-white hover:bg-gray-600 p-2">
//                           Tất cả sản phẩm
//                         </li>
//                       </Link>
//                       <Link to={"/admin/category"}>
//                         <li className="text-white hover:bg-gray-600 p-2">
//                           Danh mục
//                         </li>
//                       </Link>
//                       <Link to={"/admin/brand"}>
//                         <li className="text-white hover:bg-gray-600 p-2">
//                           Thương hiệu
//                         </li>
//                       </Link>
//                     </ul>
//                   )}
//                 </li>

//                 <li
//                   className="p-3 text-white text-xl cursor-pointer"
//                   onClick={toggleTopic}
//                 >
//                   <div className="flex justify-between hover:bg-gray-400 items-center">
//                     <FaRegNewspaper className="mr-2" />
//                     <span>Bài Viết</span>
//                     {isTopicDown ? (
//                       <IoMdArrowDropdownCircle className="inline" />
//                     ) : (
//                       <IoMdArrowDroprightCircle className="inline" />
//                     )}
//                   </div>
//                   {isTopicOpen && (
//                     <ul className="ml-4 mt-2 space-y-2">
//                       <Link to={"/admin/post"}>
//                         <li className="text-white hover:bg-gray-600 p-2">
//                           Tất cả bài viết
//                         </li>
//                       </Link>
//                       <Link to={"/admin/topic"}>
//                         <li className="text-white hover:bg-gray-600 p-2">
//                           Chủ đề
//                         </li>
//                       </Link>
//                     </ul>
//                   )}
//                 </li>

//                 <li
//                   className="p-3 text-white text-xl cursor-pointer"
//                   onClick={toggleMenu}
//                 >
//                   <div className="flex justify-between hover:bg-gray-400 items-center">
//                     <FaBars className="mr-2" />
//                     <span>Menu</span>
//                     {isMenuDown ? (
//                       <IoMdArrowDropdownCircle className="inline" />
//                     ) : (
//                       <IoMdArrowDroprightCircle className="inline" />
//                     )}
//                   </div>
//                   {isMenuOpen && (
//                     <ul className="ml-4 mt-2 space-y-2">
//                       <Link to={"/admin/menu"}>
//                         <li className="text-white hover:bg-gray-600 p-2">
//                           Menu
//                         </li>
//                       </Link>
//                       <Link to={"/admin/banner"}>
//                         <li className="text-white hover:bg-gray-600 p-2">
//                           Banner
//                         </li>
//                       </Link>
//                     </ul>
//                   )}
//                 </li>

//                 <li
//                   className="p-3 text-white text-xl cursor-pointer"
//                   onClick={toggleUser}
//                 >
//                   <div className="flex justify-between hover:bg-gray-400 items-center">
//                     <FaUserFriends className="mr-2" />
//                     <span>Thành viên</span>
//                     {isUserDown ? (
//                       <IoMdArrowDropdownCircle className="inline" />
//                     ) : (
//                       <IoMdArrowDroprightCircle className="inline" />
//                     )}
//                   </div>
//                   {isUserOpen && (
//                     <ul className="ml-4 mt-2 space-y-2">
//                       <Link to={"/admin/user"}>
//                         <li className="text-white hover:bg-gray-600 p-2">
//                           Tất cả thành viên
//                         </li>
//                       </Link>
//                       <Link to={"/admin/user/add"}>
//                         <li className="text-white hover:bg-gray-600 p-2">
//                           Thêm Thành viên
//                         </li>
//                       </Link>
//                     </ul>
//                   )}
//                 </li>

//                 <li className="text-white text-xl hover:bg-gray-600 p-2">
//                   <FaTag className="mr-3 inline" />
//                   <Link to={"/admin/productsale"}>Sản phẩm khuyến mãi</Link>
//                 </li>
//                 <li className="text-white text-xl hover:bg-gray-600 p-2">
//                   <FaTag className="mr-3 inline" />
//                   <Link to={"/admin/contact"}>Liên hệ</Link>
//                 </li>
//                 <li className="text-white text-xl hover:bg-gray-600 p-2">
//                   <FaTag className="mr-3 inline" />
//                   <Link to={"/admin/order"}>Đơn hàng</Link>
//                 </li>

//                 <li className="text-red-600 text-xl hover:bg-gray-600 p-2">
//                   <FaDownload className="mr-2 inline" />
//                   <Link to={"/admin/productstore/add"}>ImPort</Link>
//                 </li>

//                 <li className="text-green-600 text-xl hover:bg-gray-600 p-2">
//                   <FaUpload className="mr-2 inline" />
//                   <Link to={"/admin/productstore/add"}>OutPut</Link>
//                 </li>
//               </ul>
//             </nav>
//           </aside>
//         )}

//         {/* Nội dung */}
//         <div className="basis-10/12 bg-gray-100">
//           {/* Nút đóng/mở sidebar */}
//           <div className="flex justify-between items-center mb-6 bg-white shadow-md p-4 rounded-md">
//             <button
//               onClick={toggleSidebar}
//               className="text-2xl font-bold text-gray-800"
//             >
//               {isSidebarOpen ? <FiAlignJustify /> : <FiAlignLeft />}
//             </button>
//             <div className="flex space-x-4">
//               <FaBell />
//               <FaUser />
//               {/* Luôn hiển thị nút Đăng xuất */}
//               {user && (
//                 <button onClick={handleLogout} className="text-sm text-red-600">
//                   <IoMdLogOut className="inline-block mr-1" />
//                   Đăng xuất
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="p-4">
//             <Outlet />
//           </div>
//         </div>
//       </div>
//       <footer className="bg-gray-800 text-white py-4">
//         <div className="container mx-auto text-center">
//           <p>© 2024 Nim An Lực. All rights reserved.</p>
//           <nav className="justify-center space-x-4">
//             <Link to="/" className="hover:text-gray-400">
//               Privacy Policy
//             </Link>
//             <Link to="/" className="hover:text-gray-400">
//               Terms of Service
//             </Link>
//           </nav>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LayoutBackend;
import React from "react";
import Sidebar from "./sidebar";
import Admin from "./admin";
import { Outlet } from "react-router-dom";

const Dashboard = () => {


  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 p-6 text-white">
        {/* Thanh điều hướng phía trên */}
        <div className="flex justify-end items-center p-4 bg-gray-900 text-white rounded-t-2xl shadow-md">
  
        <Admin />
      </div>
      <div className="flex flex-1">

        {/* Sidebar */}
       <Sidebar />

        {/* Nội dung chính */}
        <div className="flex-1 bg-white p-6  rounded-br-2xl rounded-bl-2xl shadow-xl text-black">

          <Outlet />
        </div>

      </div>
    </div> 
  );
};

export default Dashboard;
