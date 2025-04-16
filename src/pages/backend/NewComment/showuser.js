import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NewCommentService from "../../../services/NewCommentservice";

const ShowNewCommentUser = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchNewComment = async () => {
      try {
        const result = await NewCommentService.showuser(id);
        setComments(result.newcoms); // giả sử trả về mảng các comment
        console.log(result.newcoms);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchNewComment();
  }, [id]);

  // Nhóm comments theo news_id
  const groupByNewsId = (data) => {
    const grouped = {};
    data.forEach((comment) => {
      const newsId = comment.news_id;
      if (!grouped[newsId]) grouped[newsId] = [];
      grouped[newsId].push(comment);
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

  const groupedComments = groupByNewsId(comments);

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Bình luận của người dùng ID: {id}</h2>

      {Object.keys(groupedComments).map((newsId) => (
        <div key={newsId} className="mb-6 border-b pb-4">
          <h3 className="text-md font-semibold mb-2 text-blue-600">
            📰 Tin tức ID: {newsId}
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
              {groupedComments[newsId].map((cmt) => (
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

export default ShowNewCommentUser;
