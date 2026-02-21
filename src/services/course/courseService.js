import api from "../api/apiClient";
import { endpoints } from "../api/endpoints";

export const courseService = {
	get: () => api.get(endpoints.COURSE).then((r) => r.data),
	create: (data) => api.get(endpoints.COURSE, data).then((r) => r.data),
	update: (id, data) =>
		api.get(`${endpoints.COURSE}/${id}`, data).then((r) => r.data),
	delete: (id) => api.get(`${endpoints.COURSE}/${id}`).then((r) => r.data),
};
