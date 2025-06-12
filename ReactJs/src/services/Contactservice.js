import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const ContactService = {
  index: async (page = 1) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`contact?page=${page}`, config);
  },
  trash: async () => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`contact/trash`, config);
  },
  show: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`contact/show/${id}`, config);
  },
  insert: async (data) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.post(`contact/store`, data, config);
  },
  update: async (data, id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.post(`contact/update/${id}`, data, config);
  },
  status: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`contact/status/${id}`, config);
  },
  delete: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`contact/delete/${id}`, config);
  },
  restore: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`contact/restore/${id}`, config);
  },
  destroy: async (id) => {
    const token = getAuthToken();   
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.delete(`contact/destroy/${id}`, config);
  },
  replay: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`contact/replay/${id}`, config);
  },
};

export default ContactService;
