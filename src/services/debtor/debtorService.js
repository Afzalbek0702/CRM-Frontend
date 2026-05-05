import api from "../api/apiClient";
import { endpoints } from "../api/endpoints";

export const debtorService = {
	debtors: () => api.get(`${endpoints.PAYMENTS}/debtors`).then(r => r.data),
};
