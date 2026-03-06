import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";

export const teacherService = {
	getAll: () => api.get(endpoints.TEACHERS).then((r) => r.data),

	getById: (id) =>
		api.get(`${endpoints.TEACHERS}/${id}`).then((r) => {
			console.log("API response:", r);
			return r.data;
		}),

	create: (data) => api.post(endpoints.WORKER, data).then((r) => r.data),

	update: (id, data) =>
		api.put(`${endpoints.TEACHERS}/${id}`, data).then((r) => r.data),

	delete: (id) => api.delete(`${endpoints.TEACHERS}/${id}`).then((r) => r.data),
};
