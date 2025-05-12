import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const ProductService = {
    index: async (page = null) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const url = page ? `product?page=${page}` : `product`;
        return await httpAxios.get(url, config);
    },
    trash: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product/trash`, config);
    },
    show: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product/show/${id}`, config);
    },
    insert: async (data) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`product/store`, data, config);
    },
    update: async (id, data) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`product/update/${id}`, data, config);
    },
    status: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product/status/${id}`, config);
    },
    delete: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product/delete/${id}`, config);
    },
    restore: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product/restore/${id}`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`product/destroy/${id}`, config);
    },
    bestseller: async (limit) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product_bestseller/${limit}`, config);
    },
    sale: async (limit) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product_sale/${limit}`, config);
    },
    new: async (limit) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product_new/${limit}`, config);
    },
    detail: async (slug, limit) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product_detail/${slug}/${limit}`, config);
    },
    product: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`product`, config);
    },
};

export default ProductService;
