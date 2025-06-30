import React, { useState, useEffect } from "react";
import ChatService from "../../../services/Chatservice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faShoppingCart,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";

const ResizableChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const navigate = useNavigate();

  // Cấu hình
  const PRODUCT_KEYWORDS = [
    "giày",
    "nước hoa",
    "áo",
    "quần",
    "quần áo",
    "giày",
    "thời trang",
  ];
  const BASE_API_URL = "http://127.0.0.1:8000/api/frontend";

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
        setChats(
          response.data.map((chat) => ({
            ...chat,
            messages: Array.isArray(chat.messages) ? chat.messages : [],
          }))
        );
      }
    } catch (error) {
      console.error("Lỗi khi tải cuộc trò chuyện:", error);
      toast.error("Lỗi khi tải danh sách cuộc trò chuyện!");
    }
  };

  const sendUserMessage = async () => {
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
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      toast.error("Lỗi khi gửi tin nhắn!");
    }
  };

  const extractSearchQuery = (message) => {
    const matchedKeywords = PRODUCT_KEYWORDS.filter((keyword) =>
      new RegExp(`\\b${keyword}\\b`, "i").test(message)
    );
    return matchedKeywords.length > 0 ? matchedKeywords.join(" ") : message;
  };

  const searchProducts = async (query) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/product_search`, {
        params: { query },
      });
      return response.data?.status ? response.data.products : [];
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
      return [];
    }
  };

  const handleProductSelection = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderProductResults = (products) => {
    return (
      <div className="product-results mt-2">
        <div className="text-sm mb-2">
          Tìm thấy {products.length} sản phẩm phù hợp:
        </div>

        {/* Container với thanh cuộn */}
        <div className="product-scroll-container max-h-[300px] overflow-y-auto pr-2">
          <div className="grid gap-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-item p-2 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors"
                onClick={() => handleProductSelection(product.id)}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="text-orange-500 mr-2"
                  />
                  <div className="flex-1 min-w-0">
                    {" "}
                    {/* Thêm min-w-0 để xử lý text overflow */}
                    <div className="font-medium text-sm truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Giá:{" "}
                      {product.min_price
                        ? new Intl.NumberFormat("vi-VN").format(
                            product.min_price
                          ) + "₫"
                        : "Liên hệ"}
                      {product.discount_percent && (
                        <span className="ml-2 text-orange-500">
                          -{product.discount_percent}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Nhấn vào sản phẩm để xem chi tiết
        </div>
      </div>
    );
  };
  const getGeminiResponse = async (message) => {
    setIsBotTyping(true);

    try {
      const lowerCaseMessage = message.toLowerCase();

      // Kiểm tra từ khóa sản phẩm
      const productKeywords = PRODUCT_KEYWORDS.filter((keyword) =>
        new RegExp(`(?:tìm|mua)\\s*${keyword}`, "i").test(message)
      );

      if (productKeywords.length > 0) {
        const query = productKeywords.join(" ");
        const products = await searchProducts(query);

        if (products.length > 0) {
          return {
            type: "products",
            content: (
              <div>
                <div>Tìm thấy {products.length} sản phẩm phù hợp:</div>
                {renderProductResults(products)}
              </div>
            ),
          };
        }
        return `Không tìm thấy sản phẩm "${query}". Bạn muốn tìm loại nào khác không?`;
      }
      const REACT_APP_GEMINI_AI = process.env.REACT_APP_GEMINI_AI;

      const ai = new GoogleGenAI({
        apiKey: REACT_APP_GEMINI_AI,
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `1.Bạn là trợ lý ảo thân thiện của shop Anon chuyên bán giày áo quần nước hoa mũ
        2.Hướng dẫn cách mua : Nếu muốn mua sản phẩm bạn chỉ cần gõ tìm 1 loại quần hoặc áo giày,v.v . Hãy trả lời ngắn gọn, hữu ích cho câu hỏi sau bằng tiếng Việt: ${message}`,
      });
      return response.text;
    } catch (error) {
      console.error("Lỗi khi xử lý tin nhắn:", error);
      return "Xin lỗi, tôi gặp chút khó khăn. Bạn vui lòng hỏi lại nhé!";
    } finally {
      setIsBotTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (selectedChat) {
      await sendUserMessage();
    } else {
      const userMsg = {
        id: Date.now(),
        message: newMessage,
        sender_id: currentUserId,
        created_at: new Date().toISOString(),
        is_bot: false,
      };
      setMessages((prev) => [...prev, userMsg]);
      setNewMessage("");

      const botResponse = await getGeminiResponse(newMessage);

      const botMsg = {
        id: Date.now() + 1,
        message:
          typeof botResponse === "object" ? botResponse.content : botResponse,
        sender_id: 0,
        created_at: new Date().toISOString(),
        is_bot: true,
        type: typeof botResponse === "object" ? botResponse.type : "text",
      };

      setMessages((prev) => [...prev, botMsg]);
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const response = await ChatService.getMessagesByChat(chat.id);
      if (response.status && Array.isArray(response.data)) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải tin nhắn:", error);
      toast.error("Lỗi khi tải tin nhắn!");
    }
  };

  const switchToBot = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  const renderMessageContent = (msg) => {
    if (msg.type === "products") {
      return msg.message;
    }
    return <div className="text-sm">{msg.message}</div>;
  };

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSelectedChat(null);
    }
  };

  return (
    <div className="chat-container fixed bottom-4 right-4 z-[1000]">
      {!isOpen && (
        <button
          className="chat-toggle-btn bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition text-sm shadow-md"
          onClick={toggleChatBox}
        >
          Chat
        </button>
      )}

      {isOpen && (
        <div className="chat-box fixed bottom-0 right-0 w-full max-w-[90vw] h-[80vh] max-h-[500px] bg-white rounded-t-lg shadow-lg md:max-w-[600px] md:h-[400px] md:bottom-4 md:right-4 md:rounded-lg flex flex-col">
          {/* Header */}
          <div className="chat-header bg-gray-100 p-2 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
            <h4 className="text-sm font-semibold m-0 truncate">
              {selectedChat
                ? (selectedChat.user1_id === currentUserId
                    ? selectedChat.user2?.name
                    : selectedChat.user1?.name) || "Chat"
                : "Trợ lý ảo Shopee"}
            </h4>
            <button
              className="text-lg bg-transparent border-none cursor-pointer hover:text-orange-500"
              onClick={toggleChatBox}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Danh sách cuộc trò chuyện */}
            <div
              className={`chat-list w-full md:w-1/3 border-r border-gray-200 flex flex-col overflow-hidden ${
                selectedChat ? "hidden md:flex" : "flex"
              }`}
            >
              <div className="bg-gray-100 p-2 border-b border-gray-200 flex justify-between">
                <h4 className="text-sm font-semibold m-0">Tất cả</h4>
                <button
                  onClick={switchToBot}
                  className="text-orange-500 hover:underline text-xs"
                >
                  Trợ lý ảo
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => {
                  const otherUser =
                    chat.user1_id === currentUserId ? chat.user2 : chat.user1;
                  const lastMessage = chat.messages?.[chat.messages.length - 1];
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
                            ? new Date(
                                lastMessage.created_at
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
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
            </div>

            {/* Khung chat chính */}
            <div
              className={`chat-main w-full md:w-2/3 flex flex-col overflow-auto ${
                selectedChat ? "flex" : "flex"
              }`}
            >
              <div className="flex-1 p-2 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-2 flex ${
                        msg.sender_id === currentUserId || !msg.is_bot
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          msg.sender_id === currentUserId || !msg.is_bot
                            ? "bg-orange-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {renderMessageContent(msg)}
                        <div
                          className={`text-[10px] mt-1 ${
                            msg.sender_id === currentUserId || !msg.is_bot
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
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-500">
                    {selectedChat ? (
                      <>
                        <FontAwesomeIcon
                          icon={faComments}
                          className="text-3xl mb-3 text-orange-400"
                        />
                        <p className="text-sm">
                          Bắt đầu trò chuyện với{" "}
                          {selectedChat.user1_id === currentUserId
                            ? selectedChat.user2?.name
                            : selectedChat.user1?.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-center mt-4 mb-4">
                          <FontAwesomeIcon
                            icon={faShoppingCart}
                            className="text-4xl mb-3 text-orange-500 animate-bounce"
                          />
                          <p className="font-medium text-orange-600 mb-2">
                            Xin chào! Tôi là trợ lý ảo Anon
                          </p>
                          <p className="text-sm text-gray-600 mb-4"></p>
                        </div>

                        <div className="bg-orange-50 p-3 rounded-lg mb-4">
                          <p className="font-semibold text-sm text-orange-700 mb-2">
                            💡 Hướng dẫn sử dụng:
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <div className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                1
                              </div>
                              <p className="text-xs text-gray-700">
                                <span className="font-medium">
                                  Tìm sản phẩm:
                                </span>{" "}
                                Gõ "Tôi cần mua [tên sản phẩm]" hoặc "Tìm [quần
                                áo/giày...]"
                              </p>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                2
                              </div>
                              <p className="text-xs text-gray-700">
                                <span className="font-medium">
                                  Chat với người khác:
                                </span>{" "}
                                Chọn tên người từ danh sách bên trái
                              </p>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                3
                              </div>
                              <p className="text-xs text-gray-700">
                                <span className="font-medium">
                                  Quay lại trợ lý ảo:
                                </span>{" "}
                                Nhấn nút "Trợ lý ảo" trên danh sách chat
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border border-orange-200 rounded-lg p-3">
                          <p className="font-semibold text-xs text-orange-600 mb-2">
                            🔎 Bạn có thể thử:
                          </p>
                          <div className="space-y-2">
                            <button
                              onClick={() =>
                                setNewMessage("Tôi muốn mua quần short")
                              }
                              className="text-left w-full bg-white hover:bg-orange-50 border border-orange-200 text-xs p-2 rounded-md transition-colors"
                            >
                              "Tôi muốn mua quần short"
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {isBotTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 p-2 flex gap-2">
                <input
                  type="text"
                  placeholder={
                    selectedChat
                      ? "Nhập tin nhắn..."
                      : "Nhập tin nhắn cho trợ lý ảo..."
                  }
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs"
                />
                <button
                  onClick={sendMessage}
                  disabled={isBotTyping}
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
