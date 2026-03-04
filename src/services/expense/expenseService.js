import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const expenseService = {
  get: () => api.get(withTenant(endpoints.EXPENSE)).then((r) => r.data),
  create: (data) => api.post(withTenant(endpoints.EXPENSE), data).then((r) => r.data),
  update: (id, data) =>
    api.put(withTenant(`${endpoints.EXPENSE}/${id}`), data).then((r) => r.data),
  delete: (id) => api.delete(withTenant(`${endpoints.EXPENSE}/${id}`)).then((r) => r.data),
};