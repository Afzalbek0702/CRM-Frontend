import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";

export const salaryService = {
	get: () => api.get(endpoints.SALARY).then((r) => r.data),

	create: (data) => api.post(endpoints.SALARY, data).then((r) => r.data),

	update: (id, data) =>
		api.put(`${endpoints.SALARY}/${id}`, data).then((r) => r.data),

	delete: (id) => api.delete(`${endpoints.SALARY}/${id}`).then((r) => r.data),
};
