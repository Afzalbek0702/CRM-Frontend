import { useState, useEffect } from "react";
import { FaUser, FaUsers, FaDollarSign, FaCreditCard, FaSave, FaPlus, FaTimes } from "react-icons/fa";

export default function PaymentModal({ isOpen, onClose, onSubmit, initialData }) {
	const [formData, setFormData] = useState({
		student_id: "",
		group_id: "",
		amount: "",
		method: "cash",
		paid_at: "",
	});

	useEffect(() => {
		if (initialData) {
			const paidDate = initialData.paid_at ? String(initialData.paid_at).split("T")[0] : "";
			setFormData({
				student_id: initialData.student_id || "",
				group_id: initialData.group_id || "",
				amount: initialData.amount || "",
				method: initialData.method || "cash",
				paid_at: paidDate,
			});
		} else {
			const today = new Date().toISOString().split("T")[0];
			setFormData({
				student_id: "",
				group_id: "",
				amount: "",
				method: "cash",
				paid_at: today,
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
		if (!formData.amount || parseFloat(formData.amount) <= 0) {
			alert("To'lov miqdori 0 dan katta bo'lishi kerak");
			return;
		}
		const payload = {
			...formData,
			amount: formData.amount === "" ? 0 : Number(formData.amount),
		};
		onSubmit(payload);
		setFormData({
			student_id: "",
			group_id: "",
			amount: "",
			method: "cash",
			paid_at: new Date().toISOString().split("T")[0],
		});
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
							<h2>{initialData ? "Edit Payment" : "New Payment"}</h2>
							<p className="panel-subtitle">{initialData ? "Update payment details" : "Record a new payment"}</p>
						</div>
					</div>
					<button className="close-button" onClick={onClose}><FaTimes /></button>
				</div>

				<form onSubmit={handleSubmit} className="modal-form">
					<div className="form-grid">
						<div className="form-group">
							<label className="form-label"><FaUser className="field-icon" /> Student ID</label>
							<input name="student_id" className="form-input" required value={formData.student_id} onChange={handleChange} />
						</div>

						<div className="form-group">
							<label className="form-label"><FaUsers className="field-icon" /> Group ID</label>
							<input name="group_id" className="form-input" required value={formData.group_id} onChange={handleChange} />
						</div>

						<div className="form-group">
							<label className="form-label"><FaDollarSign className="field-icon" /> Amount</label>
							<input name="amount" type="number" className="form-input" required value={formData.amount} onChange={handleChange} />
						</div>

						<div className="form-group">
							<label className="form-label"><FaCreditCard className="field-icon" /> Method</label>
							<select name="method" className="form-input" value={formData.method} onChange={handleChange}>
								<option value="cash">Cash</option>
								<option value="card">Card</option>
								<option value="transfer">Transfer</option>
							</select>
						</div>

						<div className="form-group full-width">
							<label className="form-label">Payment Date</label>
							<input name="paid_at" type="date" className="form-input" required value={formData.paid_at} onChange={handleChange} />
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
