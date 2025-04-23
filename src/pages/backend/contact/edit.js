import React, { useState, useEffect } from "react";
import ContactService from "../../../services/Contactservice";
import { Link, useParams } from "react-router-dom";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactEdit = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(1);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const result = await ContactService.show(id);
        const contactdata = result.contact;
        if (contactdata) {
          setName(contactdata.name);
          setEmail(contactdata.email);
          setPhone(contactdata.phone);
          setTitle(contactdata.title);
          setContent(contactdata.content);
          setStatus(contactdata.status);
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        toast.error("Có lỗi xảy ra khi tải thông tin liên hệ!");
      }
    };

    fetchContact();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const result=await ContactService.update(
        {
          name,
          email,
          phone,
          title,
          content,
          status,
        },
        id
      );
      if (result.status) {
      toast.success("Cập nhật liên hệ thành công!");
      }
      else{
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Có lỗi xảy ra khi cập nhật liên hệ!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="py-3">
          <Link to="/admin/contact" className="bg-red-500 text-white px-4 py-2 rounded-md">
            Quay lại
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Chỉnh sửa liên hệ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Tên liên hệ</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Nội dung</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Đang hoạt động</option>
              <option value={2}>Không hoạt động</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cập nhật liên hệ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactEdit;
