import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import "./Login.css";
import phoneFormat from "../utils/phoneFormat";
import { useAuth } from "../context/authContext";

const Login = () => {
	const [formData, setFormData] = useState({ password: "", phone: "+(998)" });
	const { login, loading } = useAuth();
   const navigate = useNavigate()

	const handleSubmit =async (e) => {
		e.preventDefault();
		const data = await login({
			phone: phoneFormat.cleanUzPhone(formData.phone),
			password: formData.password,
      });
      navigate(`/${data.tenant}/dashboard`)
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
				<p className="login-subtitle">Iltimos xisobingizga kiring.</p>
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
