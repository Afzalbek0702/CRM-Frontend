import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const roomService = {
  get: () => api.get(withTenant(endpoints.ROOM)).then((r) => r.data),

  create: (data) => api.post(withTenant(endpoints.ROOM), data).then((r) => r.data),

  update: (id, data) => api.put(withTenant(`${endpoints.ROOM}/${id}`), data).then((r) => r.data),

  delete: (id) => api.delete(withTenant(`${endpoints.ROOM}/${id}`)).then((r) => r.data),
};