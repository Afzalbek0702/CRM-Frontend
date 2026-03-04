import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const archiveService = {
  getArchivedGroups: () => api.get(withTenant(`${endpoints.ARCHIVE}/groups`)).then((r) => r.data),
  getArchivedGroupById: (id) => api.get(withTenant(`${endpoints.ARCHIVE}/groups/${id}`)).then((r) => r.data),
  getAllArchivedPayments: () => api.get(withTenant(`${endpoints.ARCHIVE}/payments`)).then((r) => r.data),
  getAllArchivedLeads: () => api.get(withTenant(`${endpoints.ARCHIVE}/leads`)).then((r) => r.data),
  getAllArchivedGroupsStudents: () => api.get(withTenant(`${endpoints.ARCHIVE}/group-students`)).then((r) => r.data),
  getAllArchivedStudents: () => api.get(withTenant(`${endpoints.ARCHIVE}/students`)).then((r) => r.data),
  getAllArchivedTeachers: () => api.get(withTenant(`${endpoints.ARCHIVE}/teachers`)).then((r) => r.data),
};