import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";

export const authService = {
	login: (data) => api.post(endpoints.LOGIN, data).then((r) => r.data),
	register: (data) => api.post(endpoints.REGISTER, data).then((r) => r.data),
	me: () => api.get("/auth/me").then((r) => r.data),
};
