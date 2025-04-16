import httpAxios from "./httpAxios";

const getAuthToken = () => {
    try {
        return JSON.parse(localStorage.getItem("token")); // sẽ tự bỏ ""
    } catch (e) {
        return localStorage.getItem("token"); // fallback nếu không parse được
    }
};
const CartService = {
    index: async (page = 1) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`cart?page=${page}`, config);
    },
    show: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`cart/show/${id}`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`cart/destroy/${id}`, config);
    },
};

export default CartService;
