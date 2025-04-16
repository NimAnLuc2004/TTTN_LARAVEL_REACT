import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NewCommentService from "../../../services/NewCommentservice";

const ShowNewCommentNew = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchNewComment = async () => {
      try {
        const result = await NewCommentService.shownew(id); // Lấy toàn bộ comment theo news_id
        setComments(result.newcoms);
        console.log(result.newcoms);
      } catch (error) {
        console.error("Error fetching newcomment:", error);
      }
    };

    fetchNewComment();
  }, [id]);

  // Nhóm các comment theo user_id
  const groupByUserId = (data) => {
    const grouped = {};
    data.forEach((comment) => {
      const userId = comment.user_id;
      if (!grouped[userId]) grouped[userId] = [];
      grouped[userId].push(comment);
    });
    return grouped;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!comments.length) return <div>Đang tải hoặc không có bình luận...</div>;

  const groupedComments = groupByUserId(comments);

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Bình luận cho tin tức ID: {id}</h2>

      {Object.keys(groupedComments).map((userId) => (
        <div key={userId} className="mb-6 border-b pb-4">
          <h3 className="text-md font-semibold mb-2 text-green-600">
            👤 Người dùng ID: {userId}
          </h3>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Nội dung</th>
                <th className="border px-2 py-1">Ngày tạo</th>
                <th className="border px-2 py-1">Ngày cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {groupedComments[userId].map((cmt) => (
                <tr key={cmt.id}>
                  <td className="border px-2 py-1">{cmt.id}</td>
                  <td className="border px-2 py-1">{cmt.comment}</td>
                  <td className="border px-2 py-1">{formatDate(cmt.created_at)}</td>
                  <td className="border px-2 py-1">{formatDate(cmt.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <Link
        to="/admin/newcomment"
        className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default ShowNewCommentNew;
