import { useState } from "react";
import { useCourse } from "../services/course/useCourse";
import { useRoom } from "../services/room/useRoom";
import Loader from "../components/Loader";
import { FaPlus, FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
import ActionMenu from "../components/ActionMenu";

export default function Settings() {
    const { courseData, isLoading, create, update, deleteById } = useCourse();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: "", lesson_count: "" });
    const {
        roomData,
        isLoading: roomLoading,
        create: createRoom,
        update: updateRoom,
        deleteById: deleteRoom
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

    const handleActionMenu = (e, course) => {
        e.stopPropagation();
        setSelectedCourse(course);
        const rect = e.currentTarget.getBoundingClientRect();
        setActionMenuPosition({
            top: rect.bottom + window.scrollY + 8 + "px",
            left: rect.right + window.scrollX - 150 + "px",
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

    if (isLoading) return <Loader />;
    console.log(roomData);


    return (
        <div className="table-container">
            <h1>Admin Settings</h1>

            <h2>Courses</h2>

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
                <p>No courses yet</p>
            )}


            <hr style={{ margin: "40px 0" }} />

            <h2>Rooms</h2>

            <div style={{ marginBottom: "20px" }}>
                <button className="btn1" onClick={openCreateRoom}>
                    <FaPlus /> Add Room
                </button>
            </div>

            {roomData.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Capacity</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomData.map((room) => (
                            <tr key={room.name}>
                                <td>{room.name}</td>
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
                <p>No rooms yet</p>
            )}

            {/* modal start */}

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


            {roomModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>{editingRoom ? "Edit Room" : "Add Room"}</h2>

                        <form onSubmit={handleRoomSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={roomForm.name}
                                    onChange={handleRoomChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label>Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={roomForm.capacity}
                                    onChange={handleRoomChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div style={{ marginTop: "20px" }}>
                                <button type="submit" className="btn1">
                                    {editingRoom ? "Update" : "Create"}
                                </button>

                                <button
                                    type="button"
                                    className="btn2"
                                    onClick={() => setRoomModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
                            deleteById(actionMenu.course.id);
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