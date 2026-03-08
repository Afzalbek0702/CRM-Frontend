import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [tenant, setTenant] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchUser = async () => {
		if (window.location.pathname === "/login") return;

		// const hasToken = document.cookie.includes("token");
		// if (!hasToken) return;

		try {
			const res = await authService.me();
			setTenant(res.tenant);
			setUser(res.user);
		} catch (err) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const login = async (data) => {
		try {
			setLoading(true);
			const res = await authService.login(data);
			setTenant(res.tenant);
			setUser(res.user);
			return { user: res.user, tenant: res.tenant };
		} catch (error) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await authService.logout();
			setUser(null);
			setTenant(null);
			window.location.href = "/login";
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				tenant,
				setUser,
				login,
				logout,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
