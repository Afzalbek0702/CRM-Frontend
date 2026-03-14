import { useState, useEffect } from "react";
import {
	FaUser,
	FaPhone,
	FaSave,
	FaTimes,
	FaDollarSign,
	FaBriefcase,
	FaBirthdayCake,
	FaLock,
} from "react-icons/fa";

export default function WorkerModal({ isOpen, onClose, onSubmit, initialData }) {
	const [formData, setFormData] = useState({
		full_name: "",
		phone: "",
		password: "",
		salary: "",
		birthday: "",
		position: "",
		role: "",
		salary_type: "CASH",
		img: null,
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				full_name: initialData.full_name || "",
				phone: initialData.phone || "",
				password: "",
				salary: initialData.salary || "",
				birthday: initialData.birthday || "",
				position: initialData.position || "",
				role: initialData.role || "",
				salary_type: initialData.salary_type || "CASH",
				img: null,
			});
		} else {
			setFormData({
				full_name: "",
				phone: "",
				password: "",
				salary: "",
				birthday: "",
				position: "",
				role: "",
				salary_type: "CASH",
				img: null,
			});
		}
	}, [initialData, isOpen]);

	if (!isOpen) return null;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			...formData,
			role: formData.role.toUpperCase(),
			salary_type: formData.salary_type.toUpperCase(),
		};

		console.log(payload);
		

		await onSubmit(payload);
	};

	return (
		<>
			<div className="side-panel-backdrop" onClick={onClose}></div>

			<div className="side-panel" onClick={(e) => e.stopPropagation()}>
				<div className="panel-header">
					<div className="panel-title-section">
						<h2>
							{initialData ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}
						</h2>
					</div>

					<button className="close-button" onClick={onClose}>
						<FaTimes />
					</button>
				</div>

				<form className="modal-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label className="form-label">
							<FaUser /> Ism
						</label>
						<input
							className="form-input"
							name="full_name"
							value={formData.full_name}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label className="form-label">
							<FaPhone /> Telefon
						</label>
						<input
							className="form-input"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							required
						/>
					</div>

					{!initialData && (
						<div className="form-group">
							<label className="form-label">
								<FaLock /> Parol
							</label>
							<input
								type="password"
								className="form-input"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
							/>
						</div>
					)}

					<div className="form-group">
						<label className="form-label">
							<FaDollarSign /> Maosh
						</label>
						<input
							type="number"
							className="form-input"
							name="salary"
							value={formData.salary}
							onChange={handleChange}
						/>
					</div>

					<div className="form-group">
						<label className="form-label">
							<FaBirthdayCake /> Tug'ilgan sana
						</label>
						<input
							type="date"
							className="form-input"
							name="birthday"
							value={formData.birthday}
							onChange={handleChange}
						/>
					</div>

					<div className="form-group">
						<label className="form-label">
							<FaBriefcase /> Lavozim
						</label>
						<select
							className="form-input"
							name="position"
							value={formData.position}
							onChange={handleChange}
							required
						>
							<option value="">Tanlang</option>
							<option value="Teacher">Teacher</option>
							<option value="Manager">Manager</option>
							<option value="Administrator">Administrator</option>
							<option value="Director">Director</option>
							<option value="Accountant">Accountant</option>
							<option value="Other">Other</option>
						</select>
					</div>

					<div className="form-group">
						<label className="form-label">Role</label>
						<select
							className="form-input"
							name="role"
							value={formData.role}
							onChange={handleChange}
							required
						>
							<option value="">Tanlang</option>
							<option value="ADMIN">Admin</option>
							<option value="MANAGER">Manager</option>
							<option value="TEACHER">Teacher</option>
							<option value="CEO">CEO</option>
						</select>
					</div>

					<div className="form-group">
						<label className="form-label">Maosh turi</label>
						<select
							className="form-input"
							name="salary_type"
							value={formData.salary_type}
							onChange={handleChange}
						>
							<option value="CASH">Naqd </option>
							<option value="BANK_TRANSFER">Bank Transfer</option>
							<option value="OTHER">Other</option>
						</select>
					</div>

					<div className="panel-buttons">
						<button type="button" className="btn btn-cancel" onClick={onClose}>
							Bekor qilish
						</button>

						<button type="submit" className="btn btn-default flex justify-center">
							<FaSave /> Saqlash
						</button>
					</div>
				</form>
			</div>
		</>
	);
}