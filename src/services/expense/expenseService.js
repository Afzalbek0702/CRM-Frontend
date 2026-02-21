import api from "../api/apiClient";
import { endpoints } from "../api/endpoints";

export const expenseService = {
	get: () => api.get(endpoints.EXPENSE).then((r) => r.data),
	create: (data) => api.post(endpoints.EXPENSE, data).then((r) => r.data),
	update: (id, data) =>
		api.put(`${endpoints.EXPENSE}/${id}`, data).then((r) => r.data),
	delete: (id) => api.delete(`${endpoints.EXPENSE}/${id}`).then((r) => r.data),
};
