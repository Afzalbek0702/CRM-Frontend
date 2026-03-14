import { useState, useEffect } from "react";
import { FaUser, FaPhone, FaComment, FaSave, FaPlus, FaTimes } from "react-icons/fa";
import { useCourse } from "../services/course/useCourse";

export default function LeadModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        source: "",
        interested_course: "",
        comment: "",
    });
    const {
        courseData
    } = useCourse();

    useEffect(() => {
        if (initialData) {
            setFormData({
                full_name: initialData.full_name || "",
                phone: initialData.phone || "",
                source: initialData.source || "",
                interested_course: initialData.interested_course || "",
                comment: initialData.comment || "",
            });
        } else {
            setFormData({
                full_name: "",
                phone: "",
                source: "",
                interested_course: "",
                comment: "",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            full_name: "",
            phone: "",
            source: "",
            interested_course: "",
            comment: "",
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
                            <h2>{initialData ? "Edit Lead" : "New Lead"}</h2>
                            <p className="panel-subtitle">
                                {initialData ? "Update lead details" : "Add a new lead"}
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
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Manba</label>
                            <input
                                name="source"
                                className="form-input"
                                value={formData.source}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Qiziqgan kursi</label>
                            <select
                                name="interested_course"
                                value={formData.interested_course}
                                onChange={handleChange}
                                className="form-input"
                                required
                            >
                                <option value="">Qiziqgan kursi</option>
                                {courseData.map((course) => (
                                    <option key={course.id} value={String(course.name)}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">
                                <FaComment className="field-icon" /> Izoh
                            </label>
                            <textarea
                                name="comment"
                                className="form-input"
                                value={formData.comment}
                                onChange={handleChange}
                            />
                        </div>
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