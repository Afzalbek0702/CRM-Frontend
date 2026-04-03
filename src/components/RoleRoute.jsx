import { Navigate, useLocation } from "react-router-dom";
import { routeRoles } from "../utils/authConfig";
import { useAuth } from "../context/authContext";

export default function RoleRoute({ children }) {
	const { user } = useAuth();
	const location = useLocation();

	// Extract the segment after /tenant/ e.g. "payments/income"
	const pathSegment = location.pathname.split("/").slice(2).join("/");

	// Find the first matching key (handles "payments/income", "archive/leads", etc.)
	const matchedKey = Object.keys(routeRoles).find(
		(key) => pathSegment === key || pathSegment.startsWith(key + "/"),
	);

	const allowedRoles = matchedKey ? routeRoles[matchedKey] : null;

	if (
		!allowedRoles ||
		allowedRoles.includes("") ||
		!allowedRoles.includes(user?.role)
	) {
		return <Navigate to="dashboard" replace />;
	}

	return children;
}
