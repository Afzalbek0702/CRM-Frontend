import axios from "axios";
import { navigateTo } from "@/utils/navigate";

const api = axios.create({
  baseURL: "http://localhost:7000",
//   baseURL: "https://api-crm-data-space.vercel.app",
  timeout: 7000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const tenant = window.location.pathname.split("/")[1];

  if (
		!config.url.startsWith("/auth") &&
		tenant &&
		tenant !== "login" &&
		tenant !== "superadmin"
	) {
		config.url = `/${tenant}${config.url}`;
	}

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const currentPath = window.location.pathname;

		if (err.response?.status === 401) {
			// Agar foydalanuvchi allaqachon login sahifasida bo'lsa, redirect qilmaymiz
			if (currentPath !== "/login") {
				navigateTo("/login");
			}
		}
		return Promise.reject(err);
  }
);

export default api;