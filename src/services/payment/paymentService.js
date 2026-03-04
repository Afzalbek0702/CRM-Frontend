import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const paymentService = {
  getAll: () => api.get(withTenant(endpoints.PAYMENTS)).then((r) => r.data),
  getById: (id) => api.get(withTenant(`${endpoints.PAYMENTS}/${id}`)).then((r) => r.data),
  update: (id, data) => api.put(withTenant(`${endpoints.PAYMENTS}/${id}`), data).then((r) => r.data),
  create: (data) => api.post(withTenant(endpoints.PAYMENTS), data).then((r) => r.data),
  delete: (id) => api.delete(withTenant(`${endpoints.PAYMENTS}/${id}`)).then((r) => r.data),
};