import axios from "axios";
import { navigateTo } from "../../utils/navigate";
const api = axios.create({
	baseURL: "https://api-crm-data-space.vercel.app",
	// baseURL: "http://localhost:7000",
	timeout: 7000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err.status === 401) {
         // window.location.href = "/login";
         navigateTo("/login");
		}
		return Promise.reject(err);
	},
);

export default api;