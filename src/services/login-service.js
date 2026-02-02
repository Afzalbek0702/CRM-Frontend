import api from "./api.js";
import { endpoints } from "./endpoints.js";

export const loginService = {
	login: async (data) => await api.post(endpoints.LOGIN, data),
};
