import { useState } from "react";
import "./Login.css";
import phoneFormat from "../utils/phoneFormat";
import { useAuth } from "../services/auth/useAuth";

const Login = () => {
	const [formData, setFormData] = useState({ password: "", phone: "+(998)" });
	const { login, isLoading } = useAuth();
	const handleSubmit = (e) => {
		e.preventDefault();
		login({
			phone: phoneFormat.cleanUzPhone(formData.phone),
			password: formData.password,
		});
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

					<button type="submit" disabled={isLoading} className="login-button">
						{isLoading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};
export default Login;
