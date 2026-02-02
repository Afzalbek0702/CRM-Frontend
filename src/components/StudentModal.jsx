import { useState, useEffect } from "react";
import { FaUser, FaPhone, FaBirthdayCake, FaUsers, FaSave, FaPlus, FaTimes } from "react-icons/fa";

export default function StudentModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        birthday: "",
        parents_name: "",
        balance: "",
    });

    useEffect(() => {
        if (initialData) {
            const rawBirthday = initialData.birthday;
            const birthday = rawBirthday ? String(rawBirthday).split("T")[0] : "";
            setFormData({
                full_name: initialData.full_name || "",
                phone: initialData.phone || "",
                birthday,
                parents_name: initialData.parents_name || "",
                balance: initialData.balance ?? "",
            });
        } else {
            setFormData({ full_name: "", phone: "", birthday: "", parents_name: "", balance: "" });
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
            balance: formData.balance === "" ? 0 : Number(formData.balance),
        };
        onSubmit(payload);
        setFormData({ full_name: "", phone: "", birthday: "", parents_name: "", balance: "" });
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
                            <h2>{initialData ? "Edit Student" : "New Student"}</h2>
                            <p className="panel-subtitle">{initialData ? "Update student details" : "Add a new student"}</p>
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

                        <div className="form-group">
                            <label className="form-label"><FaPhone className="field-icon" /> Phone</label>
                            <input name="phone" className="form-input" required value={formData.phone} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label"><FaBirthdayCake className="field-icon" /> Birthday</label>
                            <input name="birthday" type="date" className="form-input" value={formData.birthday} onChange={handleChange} />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label"><FaUsers className="field-icon" /> Parents</label>
                            <input name="parents_name" className="form-input" value={formData.parents_name} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label"><FaPlus className="field-icon" /> Balance</label>
                            <input name="balance" type="number" className="form-input" value={formData.balance} onChange={handleChange} />
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
