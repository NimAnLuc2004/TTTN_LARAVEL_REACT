import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const ProductSaleService = {
    index: async (page = 1) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`productsale?page=${page}`, config);
    },
    trash: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`productsale/trash`, config);
    },
    show: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`productsale/show/${id}`, config);
    },
    insert: async (data) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`productsale/store`, data, config);
    },
    update: async (data, id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`productsale/update/${id}`, data, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`productsale/destroy/${id}`, config);
    },
};

export default ProductSaleService;
