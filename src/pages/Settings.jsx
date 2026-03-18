import { useState } from "react";
import { useCourse } from "../services/course/useCourse";
import { useRoom } from "../services/room/useRoom";
import Loader from "../components/Loader";
import { FaPlus, FaTrash, FaEdit, FaEllipsisV, FaTimes } from "react-icons/fa";
import ActionMenu from "../components/ActionMenu";
import { goBack } from "../utils/navigate.js";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


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
            <Button className={"btn-default"} onClick={goBack}>← Ortga</Button>
            <h2>Admin Sozlamalari</h2>

            <h3>Kurslar</h3>
            <div className="mb-5">
                <Button onClick={openCreateModal} variant="primary" className={"btn-default"}>
                    <FaPlus /> Kurs qo'shish
                </Button>
            </div>

            {courseData.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nomi</TableHead>
                            <TableHead>Narx</TableHead>
                            <TableHead>Darslar soni</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courseData.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.price}</TableCell>
                                <TableCell>{course.lesson_count}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const top = rect.bottom + window.scrollY + 8 + "px";
                                            const left = rect.right + window.scrollX - 150 + "px";
                                            setActionMenu({ isOpen: true, position: { top, left }, course });
                                        }}
                                    >
                                        <FaEllipsisV />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p>Kurslar yo'q</p>
            )}

            <hr className="my-10" />

            {/* Rooms Section */}
            <h3>Xonalar</h3>
            <div className="mb-5">
                <Button className={"btn-default"} onClick={openCreateRoom} variant="primary">
                    <FaPlus /> Xona qo'shish
                </Button>
            </div>

            {roomData.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nomi</TableHead>
                            <TableHead>Hajmi</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roomData.map((room) => (
                            <TableRow key={room.room_id}>
                                <TableCell>{room.room_name}</TableCell>
                                <TableCell>{room.capacity}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const top = rect.bottom + window.scrollY + 8 + "px";
                                            const left = rect.right + window.scrollX - 150 + "px";
                                            setActionMenu({ isOpen: true, position: { top, left }, course: room });
                                        }}
                                    >
                                        <FaEllipsisV />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p>Xona yo'q</p>
            )}

            {/* Modals */}
            {modalOpen && (
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingCourse ? "Edit Course" : "New Course"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-inputs">
                                <div>
                                    <Label>Ism</Label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Narx</Label>
                                    <Input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Darslar soni</Label>
                                    <Input
                                        type="number"
                                        name="lesson_count"
                                        value={formData.lesson_count}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className={"btn-cancel"}>
                                    <FaTimes /> Bekor qilish
                                </Button>

                                <Button type="submit" className={"btn-default"}>
                                    {editingCourse ? (
                                        <>
                                            <FaEdit /> Yangilash
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus /> Yaratish
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {roomModalOpen && (
                <Dialog open={roomModalOpen} onOpenChange={setRoomModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingRoom ? "Edit Room" : "New Room"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleRoomSubmit}>
                            <div className="modal-inputs">
                                <div>
                                    <Label>Ism</Label>
                                    <Input
                                        name="name"
                                        value={roomForm.name}
                                        onChange={handleRoomChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Hajm</Label>
                                    <Input
                                        type="number"
                                        name="capacity"
                                        value={roomForm.capacity}
                                        onChange={handleRoomChange}
                                        required
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setRoomModalOpen(false)} className={"btn-cancel"}>
                                    <FaTimes /> Bekor qilish
                                </Button>

                                <Button type="submit" className={"btn-default"}>
                                    {editingRoom ? (
                                        <>
                                            <FaEdit /> Yangilash
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus /> Yaratish
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* Action Menu */}
            <ActionMenu
                isOpen={actionMenu.isOpen}
                position={actionMenu.position}
                onEdit={() => {
                    if (actionMenu.course?.lesson_count !== undefined) openEditModal(actionMenu.course);
                    else openEditRoom(actionMenu.course);
                    setActionMenu(prev => ({ ...prev, isOpen: false }));
                }}
                onDelete={() => {
                    if (!actionMenu.course) return;
                    if (actionMenu.course?.lesson_count !== undefined) {
                        if (window.confirm(`Delete ${actionMenu.course.name}?`)) removeCourse(actionMenu.course.id);
                    } else {
                        if (window.confirm(`Delete ${actionMenu.course.room_name}?`)) deleteRoom(actionMenu.course.room_id);
                    }
                    setActionMenu(prev => ({ ...prev, isOpen: false }));
                }}
                onClose={() => setActionMenu(prev => ({ ...prev, isOpen: false }))}
                entityLabel={actionMenu.course?.lesson_count !== undefined ? "Course" : "Room"}
            />
        </div>
    );
}
