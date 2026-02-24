import { useState } from "react";
import { useCourse } from "../services/course/useCourse";
import Loader from "../components/Loader";
import { FaPlus, FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
import ActionMenu from "../components/ActionMenu";

export default function Settings() {
    const { courseData, isLoading, create, update, deleteById } = useCourse();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: "", lesson_count: "" });
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [actionMenuPosition, setActionMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleActionMenu = (e, course) => {
        e.stopPropagation(); 
        setSelectedCourse(course);
        const rect = e.currentTarget.getBoundingClientRect();
        setActionMenuPosition({
            top: rect.bottom + 5,
            left: rect.left - 100,
        });
        setIsActionMenuOpen(true);
    };

    const handleEdit = () => {
        if (!selectedCourse) return;
        openEditModal(selectedCourse);
        setIsActionMenuOpen(false);
    };

    const handleDelete = () => {
        if (!selectedCourse) return;
        if (window.confirm(`Are you sure you want to delete ${selectedCourse.name}?`)) {
            deleteById(selectedCourse.id);
            setIsActionMenuOpen(false);
        }
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({ name: "", price: "", lesson_count: "" });
        setModalOpen(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({ name: course.name, price: course.price, lesson_count: course.lesson_count });
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await update({ id: editingCourse.id, data: formData });
            } else {
                await create(formData);
            }
            setModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteById = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await deleteById(id);
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="table-container">
            <h1>Admin Settings</h1>

            <div style={{ marginBottom: "20px" }}>
                <button className="btn1" onClick={openCreateModal}>
                    <FaPlus /> Add Course
                </button>
            </div>

            {courseData.length > 0 ? (

                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Lesson Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseData.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.name}</td>
                                    <td>{course.price}</td>
                                    <td>{course.lesson_count}</td>
                                    <td style={{ width: "10px" }} onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="icon-button"
                                            onClick={(e) => handleActionMenu(e, course)}
                                        >
                                            <FaEllipsisV />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ActionMenu
                        isOpen={isActionMenuOpen}
                        position={actionMenuPosition}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onClose={() => setIsActionMenuOpen(false)}
                        entityLabel="Course"
                    />

                </>
            ) : (
                <p>No courses yet</p>
            )}



            {modalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>{editingCourse ? "Edit Course" : "Add Course"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label>Lesson Count</label>
                                <input
                                    type="number"
                                    name="lesson_count"
                                    value={formData.lesson_count}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <button type="submit" className="btn1" style={{ marginRight: "10px" }}>
                                    {editingCourse ? "Update" : "Create"}
                                </button>
                                <button type="button" className="btn2" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>



            )}
        </div>
    );
}