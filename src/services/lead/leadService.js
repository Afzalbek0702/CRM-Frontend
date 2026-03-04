import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
	const tenant = window.location.pathname.split("/")[1];
	return tenant ? `/${tenant}${path}` : path;
};

export const leadsService = {
	getLeads: () => api.get(withTenant(endpoints.LEADS)).then((r) => r.data),
	createLead: (data) => api.post(withTenant(endpoints.LEADS), data).then((r) => r.data),
	updateLead: (id, data) => api.put(withTenant(`${endpoints.LEADS}/${id}`), data).then((r) => r.data),
	getLeadById: (id) => api.get(withTenant(`${endpoints.LEADS}/${id}`)).then((r) => r.data),
	deleteLead: (id) => api.delete(withTenant(`${endpoints.LEADS}/${id}`)).then((r) => r.data),
	convertLeadToGroup: (id, group_id) =>
		api
			.post(withTenant(`${endpoints.LEADS}/${id}/convert-to-group`), { group_id })
			.then((r) => r.data),
};