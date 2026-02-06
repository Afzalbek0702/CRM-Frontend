import api from "./api";
import { endpoints } from "./endpoints.js";

export const leadsService = {
   getLeads: async () => await api.get(endpoints.LEADS),
   createLead: async (data) => await api.post(endpoints.LEADS, data),
   deleteLead: async (id) => await api.delete(`${endpoints.LEADS}/${id}`),
   convertLeadToGroup: async (id, group_id) =>
      await api.post(`${endpoints.LEADS}/${id}/convert-to-group`, { group_id }),
};