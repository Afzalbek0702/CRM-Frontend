import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const courseService = {
  get: () => api.get(withTenant(endpoints.COURSE)).then((r) => r.data),
  create: (data) => api.post(withTenant(endpoints.COURSE), data).then((r) => r.data),
  update: (id, data) =>
    api.put(withTenant(`${endpoints.COURSE}/${id}`), data).then((r) => r.data),
  delete: (id) => api.delete(withTenant(`${endpoints.COURSE}/${id}`)).then((r) => r.data),
};