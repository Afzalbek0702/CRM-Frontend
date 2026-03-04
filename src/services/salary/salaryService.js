import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const salaryService = {
  get: () => api.get(withTenant(endpoints.SALARY)).then((r) => r.data),

  create: (data) => api.post(withTenant(endpoints.SALARY), data).then((r) => r.data),

  update: (id, data) => api.put(withTenant(`${endpoints.SALARY}/${id}`), data).then((r) => r.data),

  delete: (id) => api.delete(withTenant(`${endpoints.SALARY}/${id}`)).then((r) => r.data),
};