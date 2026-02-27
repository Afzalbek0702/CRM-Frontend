import axios from "axios";
import { navigateTo } from "../../utils/navigate";
const api = axios.create({
	baseURL: "https://api-crm-data-space.vercel.app",
	timeout: 7000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// api.interceptors.request.use((config) => {
// 	return config;
// });

api.interceptors.response.use(
	(res) => res,
	(err) => {
		console.log("api", err);

		if (err.response?.status || err.response === 401) {
			window.location.href = "/login";
			// navigateTo("/login");
      }
      // if (window.location.pathname !== "/login") {
		// 		navigateTo("/login");
		// 	}
		return Promise.reject(err);
	},
);

export default api;
