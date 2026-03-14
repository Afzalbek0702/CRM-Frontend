import { useState } from "react";
import { useCourse } from "../services/course/useCourse";
import { useRoom } from "../services/room/useRoom";
import Loader from "../components/Loader";
import { FaPlus, FaTrash, FaEdit, FaEllipsisV, FaTimes } from "react-icons/fa";
import ActionMenu from "../components/ActionMenu";
import { goBack } from "../utils/navigate.js";


export default function Settings() {
    const { courseData, isLoading, createCourse, updateCourse, removeCourse } = useCourse();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: "", lesson_count: "" });
    const {
        roomData,
        isLoading: roomLoading,
        createRoom,
        updateRoom,
        removeRoom: deleteRoom
    } = useRoom();
    const [roomModalOpen, setRoomModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [roomForm, setRoomForm] = useState({ name: "", capacity: "" });

    const [actionMenu, setActionMenu] = useState({
        isOpen: false,
        position: { top: 0, left: 0 },
        course: null,
    });

    const openCreateRoom = () => {
        setEditingRoom(null);
        setRoomForm({ name: "", capacity: "" });
        setRoomModalOpen(true);
    };

    const openEditRoom = (room) => {
        setEditingRoom(room);
        setRoomForm({
            name: room?.name ?? "",
            capacity: room?.capacity ?? "",
        });
        setRoomModalOpen(true);
    };

    const handleRoomChange = (e) => {
        const { name, value } = e.target;
        setRoomForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        if (editingRoom) {
            updateRoom({ id: editingRoom.id, data: roomForm });
        } else {
            createRoom(roomForm);
        }
        setRoomModalOpen(false);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCourse) {
            updateCourse({ id: editingCourse.id, data: formData });
        } else {
            createCourse(formData);
        }
        setModalOpen(false);
    }


    if (isLoading) return <Loader />;
    // console.log(courseData);

    console.log(roomData);


    return (
        <div className="table-container">
            <button className="btn btn-default bg-primary " onClick={goBack}>
                ← Ortga
            </button>
            <h1>Admin Sozlamalari</h1>

            <h2>Kurslar</h2>

            <div style={{ marginBottom: "20px" }}>
                <button className="btn btn-default bg-primary  text-nowrap" onClick={openCreateModal}>
                    <FaPlus /> Kurs qo'shish
                </button>
            </div>

            {courseData.length > 0 ? (

                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nomi</th>
                                <th>Narx</th>
                                <th>Darslar soni</th>
                                <th></th>
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
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();

                                                const menuHeight = 100;
                                                const menuWidth = 150;

                                                const scrollY = window.scrollY;
                                                const scrollX = window.scrollX;

                                                const absoluteTop = rect.top + scrollY;
                                                const absoluteBottom = rect.bottom + scrollY;

                                                const viewportBottom = scrollY + window.innerHeight;
                                                const viewportRight = scrollX + window.innerWidth;

                                                const top =
                                                    absoluteBottom + menuHeight > viewportBottom
                                                        ? absoluteTop - menuHeight - 8
                                                        : absoluteBottom + 8;

                                                let left = rect.right + scrollX - menuWidth;
                                                if (left + menuWidth > viewportRight) {
                                                    left = viewportRight - menuWidth - 10;
                                                }
                                                if (left < scrollX) {
                                                    left = scrollX + 10;
                                                }

                                                setActionMenu({
                                                    isOpen: true,
                                                    position: {
                                                        top: top + "px",
                                                        left: left + "px",
                                                    },
                                                    course: course
                                                });
                                            }}
                                        >
                                            <FaEllipsisV />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </>
            ) : (
                <p>Kurslar yo'q</p>
            )}


            <hr style={{ margin: "40px 0" }} />

            <h2>Xonalar</h2>

            <div style={{ marginBottom: "20px" }}>
                <button className="btn btn-default bg-primary  text-nowrap" onClick={openCreateRoom}>
                    <FaPlus /> Xona qo'shish
                </button>
            </div>

            {roomData.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nomi</th>
                            <th>Hajmi</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomData.map((room) => (
                            <tr key={room.room_id}>
                                <td>{room.room_name}</td>
                                <td>{room.capacity}</td>
                                <td style={{ width: "10px" }} onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="icon-button"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();

                                            const menuHeight = 100;
                                            const menuWidth = 150;

                                            const scrollY = window.scrollY;
                                            const scrollX = window.scrollX;

                                            const absoluteTop = rect.top + scrollY;
                                            const absoluteBottom = rect.bottom + scrollY;

                                            const viewportBottom = scrollY + window.innerHeight;
                                            const viewportRight = scrollX + window.innerWidth;

                                            const top =
                                                absoluteBottom + menuHeight > viewportBottom
                                                    ? absoluteTop - menuHeight - 8
                                                    : absoluteBottom + 8;

                                            let left = rect.right + scrollX - menuWidth;
                                            if (left + menuWidth > viewportRight) left = viewportRight - menuWidth - 10;
                                            if (left < scrollX) left = scrollX + 10;

                                            setActionMenu({
                                                isOpen: true,
                                                position: { top: top + "px", left: left + "px" },
                                                course: room
                                            });
                                        }}
                                    >
                                        <FaEllipsisV />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Xona yo'q</p>
            )}

            {/* modal start */}

            {modalOpen && (
                <>
                    <div className="side-panel-backdrop" onClick={() => setModalOpen(false)}></div>

                    <div className="side-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="panel-header">
                            <div className="panel-title-section">
                                <div className="panel-icon">
                                    {editingCourse ? <FaEdit /> : <FaPlus />}
                                </div>
                                <div>
                                    <h2>{editingCourse ? "Edit Course" : "New Course"}</h2>
                                    <p className="panel-subtitle">
                                        {editingCourse
                                            ? "Update course details"
                                            : "Create a new course"}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="close-button"
                                onClick={() => setModalOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label className="form-label">
                                        Ism
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Narx
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-input"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Darslar soni
                                    </label>
                                    <input
                                        type="number"
                                        name="lesson_count"
                                        className="form-input"
                                        value={formData.lesson_count}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="panel-buttons">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setModalOpen(false)}
                                >
                                    <FaTimes /> Bekor qilish
                                </button>

                                <button type="submit" className="btn-submit">
                                    {editingCourse ? (
                                        <>
                                            <FaEdit /> Yangilar
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
            )}


            {roomModalOpen && (
                <>
                    <div
                        className="side-panel-backdrop"
                        onClick={() => setRoomModalOpen(false)}
                    ></div>

                    <div className="side-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="panel-header">
                            <div className="panel-title-section">
                                <div className="panel-icon">
                                    {editingRoom ? <FaEdit /> : <FaPlus />}
                                </div>
                                <div>
                                    <h2>{editingRoom ? "Edit Room" : "New Room"}</h2>
                                    <p className="panel-subtitle">
                                        {editingRoom
                                            ? "Xona infolarini yangilar"
                                            : "Yangi xona yaratish"}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="close-button"
                                onClick={() => setRoomModalOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleRoomSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label className="form-label">
                                        Ism
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        value={roomForm.name}
                                        onChange={handleRoomChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Hajm
                                    </label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        className="form-input"
                                        value={roomForm.capacity}
                                        onChange={handleRoomChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="panel-buttons">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setRoomModalOpen(false)}
                                >
                                    <FaTimes /> Bekor qilish
                                </button>

                                <button type="submit" className="btn-submit">
                                    {editingRoom ? (
                                        <>
                                            <FaEdit /> Yangilash
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
            )}

            {/* modal end */}





            <ActionMenu
                isOpen={actionMenu.isOpen}
                position={actionMenu.position}
                onEdit={() => {
                    if (actionMenu.course?.lesson_count !== undefined) {
                        openEditModal(actionMenu.course);
                    } else {
                        openEditRoom(actionMenu.course);
                    }
                    setActionMenu(prev => ({ ...prev, isOpen: false }));
                }}
                onDelete={() => {
                    if (!actionMenu.course) return;
                    if (actionMenu.course?.lesson_count !== undefined) {
                        if (window.confirm(`Delete ${actionMenu.course.name}?`)) {
                            removeCourse(actionMenu.course.id);
                        }
                    } else {
                        if (window.confirm(`Delete ${actionMenu.course.name}?`)) {
                            deleteRoom(actionMenu.course.id);
                        }
                    }
                    setActionMenu(prev => ({ ...prev, isOpen: false }));
                }}
                onClose={() => setActionMenu(prev => ({ ...prev, isOpen: false }))}
                entityLabel={
                    actionMenu.course?.lesson_count !== undefined ? "Course" : "Room"
                }
            />
        </div>
    );
}
