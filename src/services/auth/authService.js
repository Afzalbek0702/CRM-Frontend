import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";

const tenant = window.location.pathname.split("/")[1];
export const authService = {
	login: (data) => api.post(endpoints.LOGIN, data).then((r) => r.data),
	register: (data) =>
		api
			.post(`${endpoints.REGISTER}?tenant=${tenant}`, data)
			.then((r) => r.data),
	me: () => api.get("/auth/me").then((r) => r.data),
};
