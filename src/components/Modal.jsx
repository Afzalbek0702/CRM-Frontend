import { useState, useEffect } from "react";
import { FaUsers, FaBook, FaDollarSign, FaClock, FaCalendarAlt, FaChalkboardTeacher, FaTimes, FaSave, FaPlus } from "react-icons/fa";
import {useTeachers} from '../hooks/useTeachers'
export default function Modal({ isOpen, onClose, onSubmit, title, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        course_type: "",
        price: "",
        lesson_time: "",
        lesson_days: [],
        teacher_id: "",
    });
    const [isAnimating, setIsAnimating] = useState(false);
   const { teachers } = useTeachers()
   
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                course_type: initialData.course_type || "",
                price: initialData.price || "",
                lesson_time: initialData.lesson_time || "",
                lesson_days: Array.isArray(initialData.lesson_days) ? initialData.lesson_days : [],
                teacher_id: initialData.teacher_id ?? null,
            });
        } else {
            setFormData({
                name: "",
                course_type: "",
                price: "",
                lesson_time: "",
                lesson_days: [],
                teacher_id: "",
            });
        }
        
        // Trigger animation when modal opens
        if (isOpen) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 400);
            return () => clearTimeout(timer);
        }
    }, [initialData, isOpen]);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayNames = {
        "Mon": "Dushanba",
        "Tue": "Seshanba", 
        "Wed": "Chorshanba",
        "Thu": "Payshanba",
        "Fri": "Juma",
        "Sat": "Shanba"
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDayToggle = (day) => {
        setFormData((prev) => ({
            ...prev,
            lesson_days: prev.lesson_days.includes(day)
                ? prev.lesson_days.filter((d) => d !== day)
                : [...prev.lesson_days, day],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            name: "",
            course_type: "",
            price: "",
            lesson_time: "",
            lesson_days: [],
            teacher_id: "",
        });
    };

    if (!isOpen) return null;

    const handlePanelClick = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            <div className="side-panel-backdrop" onClick={onClose}></div>
            <div className={`side-panel ${isAnimating ? 'modal-entering' : ''}`} onClick={handlePanelClick}>
                <div className="panel-header">
                    <div className="panel-title-section">
                        <div className="panel-icon">
                            {initialData ? <FaSave /> : <FaPlus />}
                        </div>
                        <div>
                            <h2>{title}</h2>
                            <p className="panel-subtitle">
                                {initialData ? "Guruh ma'lumotlarini tahrirlang" : "Yangi guruh yarating va dars jadvalini belgilang"}
                            </p>
                        </div>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                <FaUsers className="field-icon" />
                                Guruh nomi
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Masalan: Frontend-101"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaBook className="field-icon" />
                                Kurs turi
                            </label>
                            <input
                                type="text"
                                name="course_type"
                                value={formData.course_type}
                                onChange={handleInputChange}
                                placeholder="Masalan: Web Development"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaDollarSign className="field-icon" />
                                Oylik narx
                            </label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaClock className="field-icon" />
                                Dars vaqti
                            </label>
                            <input
                                type="text"
                                name="lesson_time"
                                value={formData.lesson_time}
                                onChange={handleInputChange}
                                placeholder="Masalan: 09:00-10:30"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">
                                <FaCalendarAlt className="field-icon" />
                                Dars kunlari
                            </label>
                            <div className="days-grid">
                                {days.map((day) => (
                                    <div 
                                        key={day} 
                                        className={`day-chip ${formData.lesson_days.includes(day) ? 'selected' : ''}`}
                                        onClick={() => handleDayToggle(day)}
                                    >
                                        <div className="day-short">{day}</div>
                                        <div className="day-full">{dayNames[day]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">
                                <FaChalkboardTeacher className="field-icon" />
                                O'qituvchi
                            </label>
                            <select
                                 name="teacher_id"
                                 value={formData.teacher_id || ''}
                                 onChange={handleInputChange}
                                 className="form-input"
                                 required
                             >
                              <option value="">O'qituvchini tanlang</option>
                              {teachers.map((teacher) => (
                                       <option key={teacher.id} value={teacher.id}>
                                       {teacher.full_name}
                                       </option>
                                       ))}
                              </select>
                        </div>
                    </div>

                    <div className="panel-buttons">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            <FaTimes /> Bekor qilish
                        </button>
                        <button type="submit" className="btn-submit">
                            {initialData ? <><FaSave /> Saqlash</> : <><FaPlus /> Yaratish</>}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}