import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";

export const paymentService = {
	getAll: () => api.get(endpoints.PAYMENTS).then((r) => r.data),
	getById: (id) => api.get(`${endpoints.PAYMENTS}/${id}`).then((r) => r.data),
	update: (id, data) =>
		api.put(`${endpoints.PAYMENTS}/${id}`, data).then((r) => r.data),
	create: (data) => api.post(endpoints.PAYMENTS, data).then((r) => r.data),
	delete: (id) => api.delete(`${endpoints.PAYMENTS}/${id}`).then((r) => r.data),
};
