import React, { useState, useEffect } from "react";
import ChatService from "../../../services/Chatservice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ResizableChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) {
      setCurrentUserId(user.id);
      fetchChats(user.id);
    } else {
      toast.error("Vui lòng đăng nhập để sử dụng chat!");
    }
  }, []);

  const fetchChats = async (userId) => {
    try {
      const response = await ChatService.getMessagesByUser(userId);
      if (response.status && Array.isArray(response.data)) {
        const sanitizedChats = response.data.map((chat) => ({
          ...chat,
          messages: Array.isArray(chat.messages) ? chat.messages : [],
        }));
        setChats(sanitizedChats);
      } else {
        toast.error("Dữ liệu cuộc trò chuyện không hợp lệ!");
        setChats([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải cuộc trò chuyện:", error);
      toast.error("Lỗi khi tải danh sách cuộc trò chuyện!");
      setChats([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) {
      toast.warn("Vui lòng nhập tin nhắn và chọn cuộc trò chuyện!");
      return;
    }
    try {
      const response = await ChatService.sendMessage({
        user1_id: currentUserId,
        user2_id:
          selectedChat.user1_id === currentUserId
            ? selectedChat.user2_id
            : selectedChat.user1_id,
        sender_id: currentUserId,
        message: newMessage,
      });
      if (response.status && response.data) {
        setMessages([...messages, response.data]);
        setNewMessage("");
        fetchChats(currentUserId);
      } else {
        toast.error("Không thể gửi tin nhắn!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      toast.error("Lỗi khi gửi tin nhắn!");
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const response = await ChatService.getMessagesByChat(chat.id);
      if (response.status && Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        toast.error("Không thể tải tin nhắn!");
        setMessages([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải tin nhắn:", error);
      toast.error("Lỗi khi tải tin nhắn!");
      setMessages([]);
    }
  };

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSelectedChat(null);
  };

  return (
    <div className="chat-container fixed bottom-4 right-4 z-[1000]">
      {/* Nút mở chat */}
      {!isOpen && (
        <button
          className="chat-toggle-btn  bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition text-sm shadow-md"
          onClick={toggleChatBox}
        >
          Chat
        </button>
      )}

      {/* Chat box chính */}
      {isOpen && (
        <div
          className={`chat-box fixed bottom-0 right-0 w-full max-w-[90vw] h-[80vh] max-h-[500px] bg-white rounded-t-lg shadow-lg transform transition-transform duration-300 md:max-w-[600px] md:h-[400px] md:bottom-4 md:right-4 md:rounded-lg ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Header */}
          <div className="chat-header bg-gray-100 p-2 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
            <h4 className="text-sm font-semibold m-0 truncate">
              {selectedChat
                ? (selectedChat.user1_id === currentUserId
                    ? selectedChat.user2?.name
                    : selectedChat.user1?.name) || "Chat"
                : "Chat"}
            </h4>
            <button
              className="text-lg bg-transparent border-none cursor-pointer hover:text-orange-500"
              onClick={toggleChatBox}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="chat-content flex flex-col h-[calc(100%-80px)] md:flex-row">
            {/* Danh sách cuộc trò chuyện (ẩn trên mobile khi chọn chat) */}
            <div
              className={`chat-list w-full md:w-1/2 border-r border-gray-200 flex flex-col ${
                selectedChat ? "hidden md:flex" : "flex"
              }`}
            >
              <div className="bg-gray-100 p-2 border-b border-gray-200">
                <h4 className="text-sm font-semibold m-0">Tất cả</h4>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => {
                  const otherUser =
                    chat.user1_id === currentUserId ? chat.user2 : chat.user1;
                  const lastMessage =
                    chat.messages && Array.isArray(chat.messages)
                      ? chat.messages[chat.messages.length - 1]
                      : null;
                  return (
                    <div
                      key={chat.id}
                      className={`p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        selectedChat?.id === chat.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-xs truncate max-w-[70%]">
                          {otherUser?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {lastMessage?.created_at
                            ? new Date(lastMessage.created_at).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            : ""}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {lastMessage?.message || "Chưa có tin nhắn"}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-2 border-t border-gray-200 text-center">
                <button className="text-orange-500 hover:underline text-xs">
                  Chọn mục bạn đến với Shopee Chat
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Bắt đầu trò chuyện mới!
                </p>
                <a
                  href="https://zalo.me/0329428959"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition text-xs"
                >
                  Liên hệ qua Zalo
                </a>
              </div>
            </div>

            {/* Ô chat chính (hiển thị khi chọn chat trên mobile) */}
            <div
              className={`chat-main w-full md:w-1/2 flex flex-col ${
                selectedChat ? "flex" : "hidden md:flex"
              }`}
            >
              <div className="flex-1 p-2 overflow-y-auto">
                {selectedChat ? (
                  messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-2 text-xs flex ${
                          msg.sender_id === currentUserId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`inline-block px-2 py-1 rounded-md break-words max-w-[80%] ${
                            msg.sender_id === currentUserId
                              ? "bg-orange-100"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="text-xs">{msg.message}</div>
                          <div
                            className={`text-[10px] text-gray-500 mt-0.5 ${
                              msg.sender_id === currentUserId
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center text-xs">
                      Chưa có tin nhắn!
                    </p>
                  )
                ) : (
                  <p className="text-gray-500 text-center text-xs">
                    Chọn một cuộc trò chuyện để bắt đầu!
                  </p>
                )}
              </div>
              <div className="border-t border-gray-200 p-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs"
                />
                <button
                  onClick={sendMessage}
                  className="bg-orange-500 text-white px-3 py-1.5 rounded-md hover:bg-orange-600 transition text-xs"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResizableChatBox;