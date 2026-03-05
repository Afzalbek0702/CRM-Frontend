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

api.interceptors.request.use((config) => {
  const tenant = window.location.pathname.split("/")[1];

  if (tenant && tenant !== "login" && tenant !== "superadmin") {
		config.url = `/${tenant}${config.url}`;
	}

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      navigateTo("/login");
    }
    return Promise.reject(err);
  }
);

export default api;