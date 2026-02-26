import { useState } from "react";
import { authService } from "../services/auth/authService";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import phoneFormat from "../utils/phoneFormat";

const Login = () => {
	const [formData, setFormData] = useState({ password: "", phone: "+(998)" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const data = await authService.login({
				...formData,
				phone: formData.phone.replace(/\D/g, ""),
         });
         
			localStorage.setItem("token", data.token);
			navigate("/dashboard");
      } catch (err) {
         console.log(err);
			setError("Login failed: " + (err.response?.data?.message || err.message));
		} finally {
			setLoading(false);
		}
	};
	const handleChange = (e) => {
		setFormData({
			...formData,
			phone: phoneFormat.formatPhone(e.target.value),
		});
   };
   
	return (
		<div className="login-container">
			<div className="login-card">
				<h2 className="login-title">
					{" "}
					<img className="logo-img" src="/logo.jpg" alt="" /> Data Space
				</h2>
				<p className="login-subtitle">Please login to your account</p>

				{error && <div className="error-message">{error}</div>}

				<form onSubmit={handleSubmit} className="login-form">
					<div className="form-group">
						<label htmlFor="phone" className="form-label">
							Telefon raqam
						</label>
						<input
							id="phone"
							type="phone"
							value={formData?.phone}
							onChange={handleChange}
							placeholder="+998 __-___-__-__"
							className="form-input"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password" className="form-label">
							Parol
						</label>
						<input
							id="password"
							type="password"
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							placeholder="********"
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
