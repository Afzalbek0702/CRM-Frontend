import { useState, useEffect } from "react";
import { FaUser, FaPhone, FaSave, FaPlus, FaTimes, FaDollarSign, FaBriefcase, FaBirthdayCake, FaLock } from "react-icons/fa";

export default function TeacherModal({ isOpen, onClose, onSubmit, initialData }) {
	const [formData, setFormData] = useState({
		full_name: "",
		phone: "",
		password: "",
		birthday: "",
		salary: "",
		salary_type: "SUM",
		position: "O'qituvchi",
	});

	useEffect(() => {
		if (initialData) {
			const rawBirthday = initialData.birthday;
			const birthday = rawBirthday ? String(rawBirthday).split("T")[0] : "";
			setFormData({
				full_name: initialData.full_name || "",
				phone: initialData.phone || "",
				password: "",
				birthday,
				salary: initialData.salary || "",
				salary_type: initialData.salary_type || "SUM",
				position: initialData.position || "O'qituvchi",
			});
		} else {
			setFormData({
				full_name: "",
				phone: "",
				password: "",
				birthday: "",
				salary: "",
				salary_type: "sum",
				position: "O'qituvchi",
			});
		}
	}, [initialData, isOpen]);

	if (!isOpen) return null;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((p) => ({ ...p, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = {
			...formData,
			birthday: formData.birthday || null,
			salary: Number(formData.salary || 0),
		};

		if (initialData && !formData.password) {
			delete payload.password;
		}

		onSubmit(payload);

		setFormData({
			full_name: "",
			phone: "",
			password: "",
			birthday: "",
			salary: "",
			salary_type: "sum",
			position: "O'qituvchi",
		});
	};

	const stop = (e) => e.stopPropagation();

	return (
		<>
			<div className="side-panel-backdrop" onClick={onClose}></div>
			<div className="side-panel" onClick={stop}>
				<div className="panel-header">
					<div className="panel-title-section">
						<div className="panel-icon">
							{initialData ? <FaSave /> : <FaPlus />}
						</div>
						<div>
							<h2>{initialData ? "Edit Teacher" : "New Teacher"}</h2>
							<p className="panel-subtitle">
								{initialData ? "Update teacher details" : "Add a new teacher"}
							</p>
						</div>
					</div>
					<button className="close-button" onClick={onClose}>
						<FaTimes />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="modal-form">
					<div className="form-grid">

						<div className="form-group full-width">
							<label className="form-label">
								<FaUser className="field-icon" /> Ism familiya
							</label>
							<input
								name="full_name"
								className="form-input"
								required
								value={formData.full_name}
								onChange={handleChange}
							/>
						</div>

						<div className="form-group">
							<label className="form-label">
								<FaPhone className="field-icon" /> Telefon raqam
							</label>
							<input
								name="phone"
								className="form-input"
								required
								value={formData.phone}
								onChange={handleChange}
							/>
						</div>

						<div className="form-group">
							<label className="form-label">
								<FaBirthdayCake className="field-icon" /> Tug'ilgan kuni
							</label>
							<input
								name="birthday"
								type="date"
								className="form-input"
								value={formData.birthday}
								onChange={handleChange}
							/>
						</div>

						<div className="form-group full-width">
							<label className="form-label">
								<FaLock className="field-icon" /> Parol
							</label>
							<input
								name="password"
								type="password"
								className="form-input"
								required={!initialData} // required only on create
								value={formData.password}
								onChange={handleChange}
							/>
						</div>

						<div className="form-group">
							<label className="form-label">
								<FaDollarSign className="field-icon" /> Oylik maosh
							</label>
							<input
								name="salary"
								type="number"
								className="form-input"
								value={formData.salary}
								onChange={handleChange}
							/>
						</div>

						<div className="form-group">
							<label className="form-label">
								<FaDollarSign className="field-icon" /> Maosh turi
							</label>
							<select
								name="salary_type"
								className="form-input"
								value={formData.salary_type}
								onChange={handleChange}
							>
								<option value="sum">So'm</option>
								<option value="percent">Foiz</option>
							</select>
						</div>

						{/* <div className="form-group full-width">
							<label className="form-label">
								<FaBriefcase className="field-icon" /> Position
							</label>
							<select
								name="position"
								className="form-input"
								value={formData.position}
								onChange={handleChange}
							>
								<option value="O'qituvchi">O'qituvchi</option>
								<option value="Support">Support</option>
								<option value="Manager">Manager</option>
							</select>
						</div> */}

					</div>

					<div className="panel-buttons">
						<button type="button" className="btn btn-cancel" onClick={onClose}>
							<FaTimes /> Bekor qilish
						</button>
						<button type="submit" className="btn btn-default flex justify-center">
							{initialData ? (
								<>
									<FaSave /> Saqlash
								</>
							) : (
								<>
									<FaPlus /> Yaratish
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
