import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const ProductdetailService = {
    index: async (page = 1) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`productdetail?page=${page}`, config);
    },
    insert: async (data) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`productdetail/store`, data, config);
    },
    update: async (data, id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`productdetail/update/${id}`, data, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`productdetail/destroy/${id}`, config);
    },
    show: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`productdetail/show/${id}`, config);
    },
};

export default ProductdetailService;
