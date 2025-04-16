import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const ChatService = {
    index: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`chat`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`chat/destroy/${id}`, config);
    },
};

export default ChatService;
