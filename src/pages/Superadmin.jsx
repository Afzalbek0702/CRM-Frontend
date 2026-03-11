import { useState } from "react";
import "./Login.css";
import phoneFormat from "../utils/phoneFormat";
import api from "../services/api/apiClient";
import { goBack } from "../utils/navigate.js";


function Superadmin() {
	const [formData, setFormData] = useState({
		password: "",
		phone: "+(998)",
		name: "",
		subdomain: "",
		adminPhone: "+(998)",
		adminPassword: "",
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		await api.post("/superadmin", {
			...formData,
			phone: phoneFormat.cleanUzPhone(formData.phone),
			adminPhone: phoneFormat.cleanUzPhone(formData.adminPhone),
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
			<button className="btn btn-default" onClick={goBack}>
				← Ortga
			</button>
			<div className="login-card">
				<h2 className="login-title">
					{" "}
					<img className="logo-img" src="/logo.jpg" alt="" /> Data Space
				</h2>
				<p className="login-subtitle">O'quv markaz qo'shish</p>
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
					<div className="form-group">
						<label htmlFor="Adminphone" className="form-label">
							Admin telefon raqami
						</label>
						<input
							id="Adminphone"
							type="phone"
							value={formData?.adminPhone}
							onChange={(e) =>
								setFormData({
									...formData,
									adminPhone: phoneFormat.formatPhone(e.target.value),
								})
							}
							placeholder="+998 __-___-__-__"
							className="form-input"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="Adminpassword" className="form-label">
							Admin paroli
						</label>
						<input
							id="Adminpassword"
							type="password"
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							placeholder="********"
							className="form-input"
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="name" className="form-label">
							O'quv markaz nomi
						</label>
						<input
							id="name"
							type="text"
							onChange={handleChange}
							placeholder="Alpha"
							className="form-input"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="domain" className="form-label">
							Subdomain
						</label>
						<input
							id="domain"
							type="text"
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							placeholder="alpha"
							className="form-input"
							required
							style={{ textTransform: "lowercase" }}
						/>
					</div>

					<button type="submit" className="login-button">
						{"Login"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default Superadmin;
