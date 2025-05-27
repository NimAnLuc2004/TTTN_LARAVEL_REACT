import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const PaymentService = {
  pending: async (page = 1) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`payment/pending?page=${page}`, config);
  },
  completed: async (page = 1) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`payment/completed?page=${page}`, config);
  },
  failed: async (page = 1) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`payment/failed?page=${page}`, config);
  },
  destroy: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.delete(`payment/destroy/${id}`, config);
  },
  show: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`payment/show/${id}`, config);
  },
  getPaymentStats: async () => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    try {
      const response = await httpAxios.get(`payment/payment-stats`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      return { cod_total: 0, bank_transfer_total: 0 };
    }
  },
};

export default PaymentService;
