import { useState, useEffect } from "react";
import { FaUser, FaPhone, FaSave, FaPlus, FaTimes } from "react-icons/fa";

export default function TeacherModal({ isOpen, onClose, onSubmit, initialData }) {
	const [formData, setFormData] = useState({
		full_name: "",
		phone: "",
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				full_name: initialData.full_name || "",
				phone: initialData.phone || "",
			});
		} else {
			setFormData({ full_name: "", phone: "" });
		}
	}, [initialData, isOpen]);

	if (!isOpen) return null;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((p) => ({ ...p, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
		setFormData({ full_name: "", phone: "" });
	};

	const stop = (e) => e.stopPropagation();

	return (
		<>
			<div className="side-panel-backdrop" onClick={onClose}></div>
			<div className="side-panel" onClick={stop}>
				<div className="panel-header">
					<div className="panel-title-section">
						<div className="panel-icon">{initialData ? <FaSave /> : <FaPlus />}</div>
						<div>
							<h2>{initialData ? "Edit Teacher" : "New Teacher"}</h2>
							<p className="panel-subtitle">{initialData ? "Update teacher details" : "Add a new teacher"}</p>
						</div>
					</div>
					<button className="close-button" onClick={onClose}><FaTimes /></button>
				</div>

				<form onSubmit={handleSubmit} className="modal-form">
					<div className="form-grid">
						<div className="form-group full-width">
							<label className="form-label"><FaUser className="field-icon" /> Full name</label>
							<input name="full_name" className="form-input" required value={formData.full_name} onChange={handleChange} />
						</div>

						<div className="form-group full-width">
							<label className="form-label"><FaPhone className="field-icon" /> Phone</label>
							<input name="phone" className="form-input" required value={formData.phone} onChange={handleChange} />
						</div>
					</div>

					<div className="panel-buttons">
						<button type="button" className="btn-cancel" onClick={onClose}><FaTimes /> Cancel</button>
						<button type="submit" className="btn-submit">{initialData ? <><FaSave /> Save</> : <><FaPlus /> Create</>}</button>
					</div>
				</form>
			</div>
		</>
	);
}
