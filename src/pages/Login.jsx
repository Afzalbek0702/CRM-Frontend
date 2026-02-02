import { useState } from "react";
import { loginService } from "../services/login-service";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const { data } = await loginService.login(formData);
			localStorage.setItem("token", data.token);
			navigate("/dashboard");
		} catch (err) {
			setError("Login failed: " + (err.response?.data?.message || err.message));
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="login-container">
			<div className="login-card">
				<h2 className="login-title"> <img className="logo-img" src="/logo.jpg" alt="" /> Data Space</h2>
				<p className="login-subtitle">Please login to your account</p>
				
				{error && <div className="error-message">{error}</div>}
				
				<form onSubmit={handleSubmit} className="login-form">
					<div className="form-group">
						<label htmlFor="username" className="form-label">Username</label>
						<input
							id="username"
							type="text"
							onChange={(e) =>
								setFormData({ ...formData, username: e.target.value })
							}
							placeholder="Enter your username"
							className="form-input"
							required
						/>
					</div>
					
					<div className="form-group">
						<label htmlFor="password" className="form-label">Password</label>
						<input
							id="password"
							type="password"
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							placeholder="Enter your password"
							className="form-input"
							required
						/>
					</div>
					
					<button type="submit" disabled={loading} className="login-button">
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};
export default Login;