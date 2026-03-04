import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const groupsService = {
  getAll: (params) => api.get(withTenant(endpoints.GROUPS), { params }).then((r) => r.data),
  getById: (id) => api.get(withTenant(`${endpoints.GROUPS}/${id}`)).then((r) => r.data),
  getStudentsInGroup: (id) => api.get(withTenant(`${endpoints.GROUPS}/${id}/students`)).then((r) => r.data),
  create: (data) => api.post(withTenant(endpoints.GROUPS), data).then((r) => r.data),
  update: (id, data) => api.put(withTenant(`${endpoints.GROUPS}/${id}`), data).then((r) => r.data),
  delete: (id) => api.delete(withTenant(`${endpoints.GROUPS}/${id}`)).then((r) => r.data),
};