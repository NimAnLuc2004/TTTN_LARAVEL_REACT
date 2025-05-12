import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const OrderService = {
    index: async (page = 1) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`order?page=${page}`, config);
    },
    trash: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`order/trash`, config);
    },
    index1: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`order/orderdetail`, config);
    },
    show: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`order/show/${id}`, config);
    },
    show1: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`order/show/orderitem/${id}`, config);
    },
    delete: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`order/delete/${id}`, config);
    },
    restore: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`order/restore/${id}`, config);
    },
    status: async (id, data) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.put(`order/status/${id}`, data, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`order/destroy/${id}`, config);
    },
    placeOrder: async (data) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`order/placeOrder`, data, config);
    },
    update: async (data, id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`order/update/${id}`, data, config);
    },
    mostOrderedProduct: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`most-ordered-product`, config);
    },
    topRevenueProducts: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`top-revenue-products`, config);
    },
    totalOrders: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`dashboard/total-orders`, config);
    },
    totalProductsSold: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`dashboard/total-products-sold`, config);
    },
};

export default OrderService;
