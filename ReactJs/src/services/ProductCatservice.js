import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const ProductCatService = {
    index: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`productcat`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`productcat/destroy/${id}`, config);
    },
};

export default ProductCatService;
