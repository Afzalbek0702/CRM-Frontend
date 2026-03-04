import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const teacherService = {
  getAll: () => api.get(withTenant(endpoints.TEACHERS)).then((r) => r.data),

  getById: (id) =>
    api.get(withTenant(`${endpoints.TEACHERS}/${id}`)).then((r) => {
      console.log("API response:", r);
      return r.data;
    }),

  create: (data) => api.post(withTenant(endpoints.TEACHERS), data).then((r) => r.data),

  update: (id, data) => api.put(withTenant(`${endpoints.TEACHERS}/${id}`), data).then((r) => r.data),

  delete: (id) => api.delete(withTenant(`${endpoints.TEACHERS}/${id}`)).then((r) => r.data),
};