import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const NewCommentService = {
    index: async (page = 1) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`newcomment?page=${page}`, config);
    },
    showuser: async (user_id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`newcomment/showuser/${user_id}`, config);
    },
    shownew: async (news_id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`newcomment/shownew/${news_id}`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`newcomment/destroy/${id}`, config);
    },
};

export default NewCommentService;
