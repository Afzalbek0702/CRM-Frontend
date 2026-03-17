import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	if (loading) {
		return <Loader></Loader>;
	}

	if (!user) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					gap: "20px",
				}}
			>
				<h2>Unauthorized</h2>
				<button onClick={() => navigate("/login")}>Login</button>
			</div>
		);
	}

	return children;
}