import httpAxios from "./httpAxios";
import { getAuthToken } from "./Auth";

const UserService = {
  index: async (page = null) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const url = page ? `user?page=${page}` : `user`;
    return await httpAxios.get(url, config);
  },
  trash: async () => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`user/trash`, config);
  },
  show: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`user/show/${id}`, config);
  },
  insert: async (data) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.post(`user/store`, data, config);
  },
  update: async (id, data) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.post(`user/update/${id}`, data, config);
  },
  status: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`user/status/${id}`, config);
  },
  delete: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`user/delete/${id}`, config);
  },
  restore: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`user/restore/${id}`, config);
  },
  destroy: async (id) => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.delete(`user/destroy/${id}`, config);
  },
  loginadmin: async (data) => {
    return await httpAxios.post(`admin/login`, data);
  },
  logout: async () => {
    const token = getAuthToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    return await httpAxios.get(`logout`, config);
  },
  profile: async () => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`admin/profile`, config);
  },
  login: async (data) => {
    return await httpAxios.post(`frontend/customer/login`, data);
  },
  register: async (data) => {
    return await httpAxios.post(`frontend/customer/register`, data);
  },
  totalUser: async () => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return await httpAxios.get(`dashboard/total-users`, config);
  },
  getUserProfile: async () => {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const response = await httpAxios.get(`frontend/user/profile`, config);
    return response;
  },
  updateProfile: async (formData) => {
    try {
      const token = getAuthToken();
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        : {};
      const response = await httpAxios.post(
        `frontend/user/profile/update`,
        formData,
        config
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    }
  },
  updateAccount: async (data) => {
    try {
      const token = getAuthToken();
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        : {};
      const response = await httpAxios.post(
        "frontend/user/update-account",
        data,
        config
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const token = getAuthToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await httpAxios.post(
        `frontend/orders/${orderId}/cancel`,
        {},
        config
      );
      return response;
    } catch (error) {
      throw new Error(error.response?.message || "Không thể hủy đơn hàng");
    }
  },
  getVouchers: async () => {
    try {
      const token = getAuthToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await httpAxios.get("frontend/vouchers", config);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.message || "Không thể tải danh sách voucher"
      );
    }
  },

  googleLogin: async (googleData) => {
    try {
      if (!googleData?.credential) {
        throw new Error("Credential is missing");
      }

      const response = await httpAxios.post(`auth/google`, {
        credential: googleData.credential,
      });

      // Kiểm tra phản hồi trực tiếp trong response
      if (!response || !response.token || !response.user) {
        throw new Error("Phản hồi từ server không hợp lệ");
      }

      return {
        status: true,
        token: response.token, // Truy cập response.token thay vì response.data.token
        user: response.user, // Truy cập response.user thay vì response.data.user
      };
    } catch (error) {
      console.error("Google login error:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      return {
        status: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Đăng nhập Google thất bại",
      };
    }
  },
  logoutuser: async () => {
    const token = getAuthToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    return await httpAxios.get(`frontend/logout`, config);
  },
};

export default UserService;
