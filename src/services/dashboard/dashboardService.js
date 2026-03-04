import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
	const tenant = window.location.pathname.split("/")[1];
	return tenant ? `/${tenant}${path}` : path;
};

export const dashboardService = {
	get: (from, to, month) =>
		api
			.get(withTenant(endpoints.DASHBOARD), { params: { from, to, month } })
			.then((r) => r.data),
};