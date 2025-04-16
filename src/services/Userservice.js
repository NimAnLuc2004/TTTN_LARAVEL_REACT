import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const UserService = {
    index: async (page = null) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const url = page ? `user?page=${page}` : `user`;
        return await httpAxios.get(url, config);
    },
    trash: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`user/trash`, config);
    },
    show: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`user/show/${id}`, config);
    },
    insert: async (data) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`user/store`, data, config);
    },
    update: async (id, data) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`user/update/${id}`, data, config);
    },
    status: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`user/status/${id}`, config);
    },
    delete: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`user/delete/${id}`, config);
    },
    restore: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`user/restore/${id}`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`user/destroy/${id}`, config);
    },
    loginadmin: async (data) => {
        return await httpAxios.post(`admin/login`, data);
    },
    logout: async () => {
        const token = getAuthToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        return await httpAxios.get(`admin/logout`,config);
    },
    profile: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`admin/profile`,config);
    },
    login: async (data) => {
        return await httpAxios.post(`customer/login`, data);
    },
    register: async (data) => {
        return await httpAxios.post(`customer/register`, data);
    },
    totalUser: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`dashboard/total-users`, config);
    },
};

export default UserService;
