import { useState, useEffect } from "react";
import { FaUsers, FaBook, FaDollarSign, FaClock, FaCalendarAlt, FaChalkboardTeacher, FaSave, FaPlus, FaDoorOpen } from "react-icons/fa";
import { useTeachers } from '../services/teacher/useTeachers';
import { useCourse } from "../services/course/useCourse";
import { useRoom } from "../services/room/useRoom";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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

export default function Modal({ isOpen, onClose, onSubmit, title, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        course_type: "",
        price: "",
        lesson_time: "",
        lesson_days: [],
        teacher_id: "",
        room_id: "",
    });

    const { teachers } = useTeachers();
    const { courseData } = useCourse();
    const { roomData: rooms } = useRoom();

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                course_type: initialData.course_type || "",
                price: initialData.price || "",
                lesson_time: initialData.lesson_time || "",
                lesson_days: Array.isArray(initialData.lesson_days) ? initialData.lesson_days : [],
                teacher_id: initialData.teacher_id ?? "",
                room_id: initialData.room_id ?? "",
            });
        } else {
            setFormData({
                name: "",
                course_type: "",
                price: "",
                lesson_time: "",
                lesson_days: [],
                teacher_id: "",
                room_id: "",
            });
        }
    }, [initialData, isOpen]);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            let updated = { ...prev, [name]: value };

            if (name === "course_type") {
                const selectedCourse = courseData.find(
                    (c) => c.id.toString() === value.toString()
                );
                if (selectedCourse) {
                    updated.price = selectedCourse.price || "";
                } else {
                    updated.price = "";
                }
            }

            return updated;
        });
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
            room_id: "",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Guruh ma'lumotlarini tahrirlang"
                            : "Yangi guruh yarating va dars jadvalini belgilang"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="modal-inputs">
                        <div>
                            <Label>
                                <FaUsers /> Guruh nomi
                            </Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>
                                <FaBook /> Kurs turi
                            </Label>
                            <Select
                                value={formData.course_type}
                                onValueChange={(value) =>
                                    handleInputChange({ target: { name: "course_type", value } })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kurs turini tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseData.map((course) => (
                                        <SelectItem key={course.id} value={String(course.id)}>
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>
                                <FaDollarSign /> Oylik narx
                            </Label>
                            <Input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>
                                <FaClock /> Dars vaqti
                            </Label>
                            <Input
                                name="lesson_time"
                                value={formData.lesson_time}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>
                                <FaCalendarAlt /> Dars kunlari
                            </Label>
                            <div>
                                {days.map((day) => (
                                    <Button
                                        type="button"
                                        key={day}
                                        variant={formData.lesson_days.includes(day) ? "default" : "outline"}
                                        className={formData.lesson_days.includes(day) ? "btn-default" : "rounded"}
                                        onClick={() => handleDayToggle(day)}
                                    >
                                        {day}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>
                                <FaChalkboardTeacher /> O'qituvchi
                            </Label>
                            <Select
                                value={formData.teacher_id}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, teacher_id: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="O'qituvchini tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers.map((teacher) => (
                                        <SelectItem key={teacher.id} value={String(teacher.id)}>
                                            {teacher.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>
                                <FaDoorOpen /> Xona
                            </Label>
                            <Select
                                value={formData.room_id}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, room_id: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Xonani tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rooms.map((r) => (
                                        <SelectItem key={r.room_id} value={String(r.room_id)}>
                                            {r.room_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" className={"btn-cancel"} onClick={onClose}>
                            Bekor qilish
                        </Button>

                        <Button type="submit" className={"btn-default"}>
                            {initialData ? (
                                <>
                                    <FaSave /> Saqlash
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
    );
}
