import api from "../api/apiClient";
import { endpoints } from "../api/endpoints";

export const workerService = {
	get: () => api.get(endpoints.WORKER).then((r) => r.data),
	create: (data) => api.get(endpoints.WORKER, data).then((r) => r.data),
	update: (id, data) =>
		api.get(`${endpoints.WORKER}/${id}`, data).then((r) => r.data),
	delete: (id) => api.get(`${endpoints.WORKER}/${id}`).then((r) => r.data),
};