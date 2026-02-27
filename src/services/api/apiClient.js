import axios from "axios";

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
		if (err.response?.status === 401) {
			window.location.href = "/login";
		}
		return Promise.reject(err);
	},
);

export default api;
