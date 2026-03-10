import api from "@/services/api/apiClient.js";
import { endpoints } from "@/services/api/endpoints.js";

export const archiveService = {
  getArchivedGroups: () => api.get(`${endpoints.ARCHIVE}/groups`).then((r) => r.data),
  getArchivedGroupById: (id) => api.get(`${endpoints.ARCHIVE}/groups/${id}`).then((r) => r.data),
  getAllArchivedPayments: () => api.get(`${endpoints.ARCHIVE}/payments`).then((r) => r.data),
  getAllArchivedLeads: () => api.get(`${endpoints.ARCHIVE}/leads`).then((r) => r.data),
  getAllArchivedGroupsStudents: () => api.get(`${endpoints.ARCHIVE}/group-students`).then((r) => r.data),
  getAllArchivedStudents: () => api.get(`${endpoints.ARCHIVE}/students`).then((r) => r.data),
  getAllArchivedTeachers: () => api.get(`${endpoints.ARCHIVE}/teachers`).then((r) => r.data),
};