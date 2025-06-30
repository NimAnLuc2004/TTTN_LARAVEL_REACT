import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const UserDiscountService = {
  index: async (page = null) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const url = page ? `user-discount?page=${page}` : `user-discount`;
    return await httpAxios.get(url, config);
  },

  store: async (data) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.post(`user-discount/store`, data, config);
  },

  show: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`user-discount/show/${id}`, config);
  },

  update: async (id, data) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.post(`user-discount/update/${id}`, data, config);
  },

  destroy: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.delete(`user-discount/destroy/${id}`, config);
  },
};

export default UserDiscountService;