import api from "../api/apiClient";
import { endpoints } from "../api/endpoints";

export const groupsService = {
	getAll: (params) => api.get(endpoints.GROUPS, { params }).then((r) => r.data),
	getById: (id) => api.get(`${endpoints.GROUPS}/${id}`).then((r) => r.data),
	getStudentsInGroup: (id) =>
		api.get(`${endpoints.GROUPS}/${id}/students`).then((r) => r.data),
	create: (data) => api.post(endpoints.GROUPS, data).then((r) => r.data),
	update: (id, data) =>
		api.put(`${endpoints.GROUPS}/${id}`, data).then((r) => r.data),
	delete: (id) => api.delete(`${endpoints.GROUPS}/${id}`).then((r) => r.data),
};
