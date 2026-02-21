import api from "../api/apiClient";
import { endpoints } from "../api/endpoints";

export const roomService = {
	get: () => api.get(endpoints.ROOM).then((r) => r.data),
	create: (data) => api.get(endpoints.ROOM, data).then((r) => r.data),
	update: (id, data) =>
		api.get(`${endpoints.ROOM}/${id}`, data).then((r) => r.data),
	delete: (id) => api.get(`${endpoints.ROOM}/${id}`).then((r) => r.data),
};
