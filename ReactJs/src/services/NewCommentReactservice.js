import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const NewCommentReactService = {
    index: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`newcommentreact`, config);
    },
    showuser: async (user_id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`newcommentreact/showuser/${user_id}`, config);
    },
    showcomment: async (comment_id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`newcommentreact/showcomment/${comment_id}`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`newcommentreact/destroy/${id}`, config);
    },
};

export default NewCommentReactService;
