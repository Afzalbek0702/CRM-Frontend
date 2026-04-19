import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [tenant, setTenant] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const fetchUser = async () => {
		try {
			const res = await authService.me();
			setTenant(res.tenant);
			setUser(res.user);
		} catch (err) {
			setUser(null);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Tizimga kirishda xatolik yuz berdi";
			setError(errorMessage);
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
			setError(null);
			const res = await authService.login(data);
			setTenant(res.tenant);
			setUser(res.user);
			return { user: res.user, tenant: res.tenant };
		} catch (error) {
			console.log(error.response.data.message);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Tizimga kirishda xatolik yuz berdi";

			setError(errorMessage);
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
   const changePassword = async (data) => {
      try {
         await authService.changePassword(data)
      } catch (error) {
         console.error("Password changing Error")
      }
   }

	return (
		<AuthContext.Provider
			value={{
				user,
				tenant,
				error,
				setUser,
				login,
            logout,
            changePassword,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
