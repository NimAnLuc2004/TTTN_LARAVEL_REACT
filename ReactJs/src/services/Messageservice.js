import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const MessageService = {
    index: async (page = 1) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`message?page=${page}`, config);
    },
    show: async (chat_id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`message/show/${chat_id}`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`message/destroy/${id}`, config);
    },
};

export default MessageService;
