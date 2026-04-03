import { Navigate, useParams } from "react-router-dom";
import { routeRoles } from "../utils/authConfig";
import { useAuth } from "../context/authContext";

export default function RequireRole({ path, children }) {
	const { user } = useAuth();
	const allowedRoles = routeRoles[path];

	if (!allowedRoles) return <Navigate to="/unauthorized" replace />;

	if (allowedRoles.includes("") || allowedRoles.length === 0) {
		return <Navigate to="/unauthorized" replace />;
	}

	if (!allowedRoles.includes(user?.role)) {
		return <Navigate to="/unauthorized" replace />;
	}

	return children;
}
