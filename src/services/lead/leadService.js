import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";

export const leadsService = {
	getLeads: () => api.get(endpoints.LEADS).then((r) => r.data),
	createLead: (data) => api.post(endpoints.LEADS, data).then((r) => r.data),
	updateLead: (id, data) =>
		api.put(`${endpoints.LEADS}/${id}`, data).then((r) => r.data),
	getLeadById: (id) => api.get(`${endpoints.LEADS}/${id}`).then((r) => r.data),
	deleteLead: (id) =>
		api.delete(`${endpoints.LEADS}/${id}`).then((r) => r.data),
	convertLeadToGroup: (id, group_id) =>
		api
			.post(`${endpoints.LEADS}/${id}/convert-to-group`, { group_id })
			.then((r) => r.data),
};
