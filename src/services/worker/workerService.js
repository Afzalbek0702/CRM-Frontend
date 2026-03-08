import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";

export const workerService = {
	get: () => api.get(endpoints.WORKER).then((r) => r.data),
	create: (data) =>
		api.post(`${endpoints.REGISTER}?tenant=dataspace`, data).then((r) => r.data),
	update: (id, data) =>
		api.put(`${endpoints.WORKER}/${id}`, data).then((r) => r.data),
	delete: (id) => api.delete(`${endpoints.WORKER}/${id}`).then((r) => r.data),
};