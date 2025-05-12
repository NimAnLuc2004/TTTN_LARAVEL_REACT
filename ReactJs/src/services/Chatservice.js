import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const ChatService = {
  index: async () => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`chat`, config);
  },
  destroy: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.delete(`chat/destroy/${id}`, config);
  },
  sendMessage: async (data) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.post(`frontend/message`, data, config);
  },
  getMessagesByUser: async (userId) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`frontend/message/${userId}`, config);
  },
  getMessagesByChat: async (chatId) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`frontend/message/chat/${chatId}`, config);
  },
  getUser: async (page = null) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const url = page ? `frontend/user?page=${page}` : `frontend/user`;
    return await httpAxios.get(url, config);
  },
};

export default ChatService;
