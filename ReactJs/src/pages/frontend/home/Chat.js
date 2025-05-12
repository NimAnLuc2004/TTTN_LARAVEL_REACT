import React, { useState, useEffect } from "react";
import ChatService from "../../../services/Chatservice";
import { toast } from "react-toastify";

const ResizableChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) {
      setCurrentUserId(user.id);
      fetchUsers();
      fetchChats(user.id);
    } else {
      toast.error("Vui lòng đăng nhập để sử dụng chat!");
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await ChatService.getUser();
      if (response.status && response.users) {
        setUsers(response.users.data || response.users);
      } else {
        toast.error("Không thể tải danh sách người dùng!");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Lỗi khi tải danh sách người dùng!");
    }
  };

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
      console.error("Error fetching chats:", error);
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
      console.error("Error sending message:", error);
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
      console.error("Error fetching messages:", error);
      toast.error("Lỗi khi tải tin nhắn!");
      setMessages([]);
    }
  };

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSelectedChat(null);
  };

  return (
    <div className="fixed bottom-3 right-3 z-50">
      {!isOpen && (
        <button
          className="bg-orange-500 text-white px-4 py-1.5 rounded-full hover:bg-orange-600 transition text-sm"
          onClick={toggleChatBox}
        >
          Chat
        </button>
      )}
      {isOpen && (
        <div className="flex gap-2">
          {/* Danh sách cuộc trò chuyện */}
          <div className="w-56 h-[320px] border border-gray-300 rounded-lg bg-white shadow-lg flex flex-col overflow-hidden">
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
                      <span className="font-medium text-xs truncate max-w-[120px]">
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
                      {lastMessage?.message || "No messages"}
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
            </div>
          </div>

          {/* Ô chat chính */}
          <div className="w-60 h-[300px] border border-gray-300 rounded-lg bg-white shadow-lg flex flex-col resize overflow-hidden min-w-[180px] min-h-[220px] max-w-[360px] max-h-[450px]">
            <div className="bg-gray-100 p-1.5 border-b border-gray-200 flex justify-between items-center">
              <h4 className="text-xs font-semibold m-0 truncate">
                {selectedChat
                  ? (selectedChat.user1_id === currentUserId
                      ? selectedChat.user2?.name
                      : selectedChat.user1?.name) || "Chat"
                  : "Chat"}
              </h4>
              <button
                className="text-base bg-transparent border-none cursor-pointer"
                onClick={toggleChatBox}
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-1.5 overflow-y-auto">
              {selectedChat ? (
                messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-1 text-[11px] flex ${
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
                        <div className="text-[11px]">{msg.message}</div>
                        <div
                          className={`text-[9px] text-gray-500 mt-0.5 ${
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
                  <p className="text-gray-500 text-center text-[11px]">
                    Chưa có tin nhắn!
                  </p>
                )
              ) : (
                <p className="text-gray-500 text-center text-[11px]">
                  Chọn một cuộc trò chuyện để bắt đầu!
                </p>
              )}
            </div>
            <div className="border-t border-gray-200 p-1.5 flex gap-1">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-[11px]"
              />
              <button
                onClick={sendMessage}
                className="bg-orange-500 text-white px-2.5 py-1 rounded-md hover:bg-orange-600 transition text-[11px]"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResizableChatBox;