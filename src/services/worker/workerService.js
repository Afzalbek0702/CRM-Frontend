import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const workerService = {
  get: () => api.get(withTenant(endpoints.WORKER)).then((r) => r.data),
  create: (data) => api.post(withTenant(endpoints.WORKER), data).then((r) => r.data),
  update: (id, data) =>
    api.put(withTenant(`${endpoints.WORKER}/${id}`), data).then((r) => r.data),
  delete: (id) =>
    api.delete(withTenant(`${endpoints.WORKER}/${id}`)).then((r) => r.data),
};