import httpAxios from "./httpAxios";

const getAuthToken = () => {
    try {
        return JSON.parse(localStorage.getItem("token")); // sẽ tự bỏ ""
    } catch (e) {
        return localStorage.getItem("token"); // fallback nếu không parse được
    }
};;

const CategoryService = {
    index: async (page = null) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const url = page ? `category?page=${page}` : `category`;
        return await httpAxios.get(url, config);
    },
    trash: async () => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`category/trash`, config);
    },
    show: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`category/show/${id}`, config);
    },
    insert: async (data) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`category/store`, data, config);
    },
    update: async (data, id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.post(`category/update/${id}`, data, config);
    },
    status: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`category/status/${id}`, config);
    },
    delete: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`category/delete/${id}`, config);
    },
    restore: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.get(`category/restore/${id}`, config);
    },
    destroy: async (id) => {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return await httpAxios.delete(`category/destroy/${id}`, config);
    },
    getProductsByCategory: async (categoryId, page = 1, perPage = 12) => {
        return await httpAxios.get('frontend/products/by-category', {
            params: { category_id: categoryId, page, per_page: perPage }
        });
    },
    getCategories: async () => {
        return await httpAxios.get('frontend/category/list');
    },
};

export default CategoryService;
