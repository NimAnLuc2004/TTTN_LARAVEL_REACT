import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const NewCatService = {
    index: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`newcat`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`newcat/destroy/${id}`, config);
    },
};

export default NewCatService;
