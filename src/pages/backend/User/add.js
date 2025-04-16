import React, { useState } from "react";
import UserService from "../../../services/Userservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserAdd = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  // Kiểm tra mật khẩu
  if (password.length < 6) {
    setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }

  // Kiểm tra số điện thoại
  if (phone.length < 6) {
    setMessage("Số điện thoại phải có ít nhất 6 chữ số.");
    return;
  }

  // Kiểm tra email hợp lệ
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setMessage("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
    return;
  }
    if (image.length === 0) {
      setMessage("Vui lòng chọn ít nhất một hình ảnh.");
      return;
    }

    const formData = new FormData();
    image.forEach((file) => formData.append("image[]", file));
    formData.append("name", name);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("status", status);
    formData.append("role", role);

    try {
     
      const response = await UserService.insert(formData);
      setMessage(response.message);
      toast.success("Tài khoản đã được thêm thành công!");
      // Nếu thêm thành công, reset form
      if (response.status) {
        setName("");
        setPassword("");
        setImage([]);
        setEmail("");
        setPhone("");
        setAddress("");
        setRole("");
        setStatus(1);
      }
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      setMessage("Có lỗi xảy ra khi thêm người dùng.");
      toast.error("Có lỗi xảy ra khi thêm tài khoản!");
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
        <h1 className="text-3xl font-bold mb-6 text-center">Thêm Người Dùng</h1>
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
              Mật khẩu
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              required
            />
            {image.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {image.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`image-${index}`}
                    className="w-20 h-20 object-cover"
                  />
                ))}
              </div>
            )}
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
          </div>
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

          <div className="col-span-2">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Thêm người dùng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAdd;
