import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";

export const dashboardService = {
	get: (from, to, month) =>
		api
			.get(endpoints.DASHBOARD, { params: { from, to, month } })
			.then((r) => r.data),
};
// from=2025-08-01&to=2026-01-31
