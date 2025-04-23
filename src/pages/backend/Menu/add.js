import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BrandService from "../../../services/Brandservice";
import CategoryService from "../../../services/Categoryservice";
import NewService from "../../../services/Newservice";
import MenuService from "../../../services/Menuservice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const MenuAdd = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [tableid, setTableid] = useState("");
  const [type, setType] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState(1);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandRes = await BrandService.index();
        const categoryRes = await CategoryService.index();
        const newRes = await NewService.index();
        setBrands(brandRes.brands);
        setCategories(categoryRes.categories);
        setNews(newRes.new);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setName("");
    setLink("");
    setTableid("");
    setType("");
    setPosition("");
    setStatus(1);
    setSelectedType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !link || !type || !position) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    const menu = new FormData();
    menu.append("name", name);
    menu.append("link", link);
    menu.append("table_id", tableid);
    menu.append("position", position);
    menu.append("status", status);
    menu.append("type", type);

    try {
      const result = await MenuService.insert(menu);
      if (result.status) {
      toast.success(" Menu đã được thêm thành công!");
      resetForm();
      }
      else{
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating menu:", error);
      toast.error(" Có lỗi xảy ra khi thêm menu.");
    }
  };
  const convertToSlug = (text) => {
    return text
      .toLowerCase()               // Chuyển đổi thành chữ thường
      .trim()                       // Loại bỏ khoảng trắng thừa
      .replace(/\s+/g, '-')         // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/[^a-z0-9\-]/g, '')  // Loại bỏ các ký tự không phải là chữ cái, số và dấu gạch ngang
      .replace(/--+/g, '-')         // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu
      .replace(/^-+|-+$/g, '');     // Loại bỏ dấu gạch ngang ở đầu và cuối
  };
  
  const handleSelect = (type, item) => {
    if (!item || !item.id) {
      setSelectedType("");
      setType("");
      setTableid(null);
      setLink("");
      return;
    }

    setSelectedType(type);
    setType(type);
    setTableid(item.id);

    let newLink = "";
    const slug = convertToSlug(item.name || item.title); 
    switch (type) {
      case "brand":
        newLink = `http://localhost:3000/thuong-hieu/${slug}`;
        break;
      case "category":
        newLink = `http://localhost:3000/danh-muc/${slug}`;
        break;
      case "new":
        newLink = `http://localhost:3000/tin-tuc/${slug}`;
        break;
      default:
        newLink = "";
    }
    setLink(newLink);
  };

  const handleCustomLinkChange = (e) => {
    const customLink = e.target.value;
    setLink(customLink);
    if (customLink) {
      setType("custom");
      setSelectedType("custom");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Thêm Menu</h1>

        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tên Menu</label>
            <input
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              type="text"
              placeholder="Nhập tên menu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Vị trí</label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="">Chọn Vị trí</option>
              <option value="mainmenu">Main Menu</option>
              <option value="footermenu">Footer Menu</option>
            </select>
          </div>

          {/* Custom Link */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Link tùy chỉnh</label>
            <input
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              type="text"
              placeholder="Nhập link tùy chỉnh"
              value={link}
              onChange={handleCustomLinkChange}
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Chọn Brand</label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              onChange={(e) => {
                const selectedBrand = brands.find(b => b.id === parseInt(e.target.value)) || null;
                handleSelect("brand", selectedBrand);
              }}
              disabled={selectedType !== "" && selectedType !== "brand"}
            >
              <option value="">Chọn Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Chọn Category</label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              onChange={(e) => {
                const selectedCategory = categories.find(c => c.id === parseInt(e.target.value)) || null;
                handleSelect("category", selectedCategory);
              }}
              disabled={selectedType !== "" && selectedType !== "category"}
            >
              <option value="">Chọn Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* News */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Chọn New</label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              onChange={(e) => {
                const selectedNew = news.find(n => n.id === parseInt(e.target.value)) || null;
                handleSelect("new", selectedNew);
              }}
              disabled={selectedType !== "" && selectedType !== "new"}
            >
              <option value="">Chọn New</option>
              {news.map((n) => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={1}>Hiển thị</option>
              <option value={2}>Ẩn</option>
            </select>
          </div>

          {/* Submit */}
          <div className="col-span-2 flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Thêm Menu
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to="/admin/menu" className="bg-red-500 text-white px-4 py-2 rounded-md">
            Quay lại
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuAdd;
