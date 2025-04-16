import httpAxios from "./httpAxios";

const getAuthToken = () => {
    try {
        return JSON.parse(localStorage.getItem("token")); // sẽ tự bỏ ""
    } catch (e) {
        return localStorage.getItem("token"); // fallback nếu không parse được
    }
};
const AddressService = {
    index: async (page = 1) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`address?page=${page}`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`address/destroy/${id}`, config);
    },
    show: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`address/show/${id}`, config);
    },
};

export default AddressService;
