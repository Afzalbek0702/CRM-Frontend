import { createContext, useContext, useEffect, useState } from "react";
import {authService } from "../services/auth/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [tenant, setTenant] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		try {
         const res = await authService.me();
         setTenant(res.tenant)
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
      const res = await authService.login(data);
      setTenant(res.tenant);
		setUser(res.user);
		return {user:res.user,tenant:res.tenant};
	};



	return (
		<AuthContext.Provider
			value={{
            user,
            tenant,
				setUser,
				login,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
