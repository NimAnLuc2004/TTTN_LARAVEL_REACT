import React, { useState, useEffect } from "react";
import UserService from "../../../services/Userservice";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserEdit = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.show(id);
 
        setName(response.user.name);
        setEmail(response.user.email);
        setPhone(response.shipping_address.phone);
        setAddress(response.shipping_address.address);
        setRole(response.user.role);
        setStatus(response.user.status);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length > 0 && password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (phone.length < 6) {
      setMessage("Số điện thoại phải có ít nhất 6 chữ số.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
      return;
    }
    const formData = new FormData();
    image.forEach((file) => formData.append("image[]", file));
    formData.append("name", name);
    if (password) formData.append("password", password);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("status", status);
    formData.append("role", role);
    try {
      const response = await UserService.update(id, formData);
      setMessage(response.message);
      if (response.status) {
    
        toast.success("Cập nhật thông tin người dùng thành công!");
        if (currentUser && parseInt(currentUser.id) === parseInt(id)) {
          // Logout nếu người dùng chỉnh sửa chính mình
          await UserService.logout();
          localStorage.removeItem("user");
          localStorage.removeItem("token"); // nếu bạn lưu token riêng
          toast.info(
            "Thông tin tài khoản đã thay đổi. Vui lòng đăng nhập lại!"
          );
          setTimeout(() => {
            window.location.href = "admin/login"; // hoặc dùng useNavigate nếu muốn mượt hơn
          }, 200);
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      setMessage("Có lỗi xảy ra khi cập nhật người dùng.");
      toast.error("Có lỗi xảy ra khi cập nhật tài khoản!");
    }
  };

  const handleFileChange = (e) => {
    setImage(Array.from(e.target.files));
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link
            to="/admin/user"
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Quay lại
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">
          Chỉnh Sửa Người Dùng
        </h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tên
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu (để trống nếu không thay đổi)
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Ảnh đại diện
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full border rounded px-3 py-2"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Điện thoại
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Địa chỉ
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vai trò
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Chọn vai trò</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Trạng thái
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="1">Kích hoạt</option>
                <option value="2">Không kích hoạt</option>
              </select>
            </div>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Cập nhật người dùng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
