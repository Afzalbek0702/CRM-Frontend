import { useState, useEffect } from "react";
import {
	FaSave,
	FaUsers,
	FaClock,
	FaMoneyBillWave,
	FaChalkboardTeacher,
	FaDoorOpen,
} from "react-icons/fa";
import { useTeachers } from "../services/teacher/useTeachers";
import { useCourse } from "../services/course/useCourse";
import { useRoom } from "../services/room/useRoom";

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
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function GroupModal({
	isOpen,
	onClose,
	onSubmit,
	title,
	initialData,
}) {
	const { teachers = [] } = useTeachers();
	const { courseData = [] } = useCourse();
	const { roomData: rooms = [] } = useRoom();

	const [formData, setFormData] = useState({
		name: "",
		course_type: "",
		price: "",
		start_time: "",
		end_time: "",
		lesson_days: [],
		teacher_id: "",
		room_id: "",
	});

	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				// Backend'dan "12:00-14:00" formatida kelsa, uni ajratib olamiz
				const times = initialData.lesson_time
					? initialData.lesson_time.split("-")
					: ["", ""];
				setFormData({
					...initialData,
					start_time: times[0] || "",
					end_time: times[1] || "",
				});
			} else {
				setFormData({
					name: "",
					course_type: "",
					price: "",
					start_time: "",
					end_time: "",
					lesson_days: [],
					teacher_id: "",
					room_id: "",
				});
			}
		}
	}, [initialData, isOpen]);

	const updateField = (name, value) => {
		setFormData((prev) => {
			const updated = { ...prev, [name]: value };
			// Kurs tanlanganda uning narxini avtomatik to'ldirish
			if (name === "course_type") {
				const selectedCourse = courseData.find(
					(c) => String(c.name) === String(value),
				);
				updated.price = selectedCourse?.price || "";
			}
			return updated;
		});
	};

	const toggleDay = (day) => {
		const currentDays = formData.lesson_days || [];
		const newDays = currentDays.includes(day)
			? currentDays.filter((d) => d !== day)
			: [...currentDays, day];
		updateField("lesson_days", newDays);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();

		// Vaqtlarni backend kutayotgan "12:00-14:00" formatiga birlashtiramiz
		const finalPayload = {
			...formData,
			lesson_time: `${formData.start_time}-${formData.end_time}`,
		};

		// Vaqtinchalik maydonlarni payload'dan o'chirib tashlaymiz
		delete finalPayload.start_time;
		delete finalPayload.end_time;

		onSubmit(finalPayload);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[95vw] sm:max-w-2xl bg-zinc-950 border-zinc-800 text-white max-h-[90vh] overflow-y-auto shadow-2xl">
				<DialogHeader className="border-b border-zinc-800 pb-4">
					<DialogTitle className="text-xl font-bold flex items-center gap-3 text-primary">
						<div className="p-2 bg-yellow-500/10 rounded-full">
							<FaUsers className="text-xl" />
						</div>
						{title}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleFormSubmit} className="space-y-6 py-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{/* Guruh nomi */}
						<div className="sm:col-span-2 space-y-2">
							<Label className="text-zinc-400 font-medium ml-1">
								Guruh nomi
							</Label>
							<Input
								placeholder="Masalan: Frontend B-22"
								className="bg-zinc-900 border-zinc-800 focus:ring-2 focus:ring-yellow-600 focus:border-transparent h-11"
								value={formData.name}
								onChange={(e) => updateField("name", e.target.value)}
								required
							/>
						</div>

						{/* Kurs turi */}
						<div className="space-y-2">
							<Label className="text-zinc-400 font-medium ml-1 flex items-center gap-2">
								Kurs yo'nalishi
							</Label>
							<Select
								value={String(formData.course_type)}
								onValueChange={(v) => updateField("course_type", v)}
								required
							>
								<SelectTrigger className="w-full bg-zinc-900 border-zinc-800 h-11">
									<SelectValue placeholder="Kursni tanlang" />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
									{courseData.map((c) => (
										<SelectItem key={c.id} value={String(c.name)}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Narxi */}
						<div className="space-y-2">
							<Label className="text-zinc-400 font-medium ml-1 flex items-center gap-2">
								<FaMoneyBillWave className="text-[10px]" /> Kurs narxi
							</Label>
							<Input
								type="number"
								className="bg-zinc-900 border-zinc-800  font-mono text-yellow-500"
								value={formData.price}
								onChange={(e) => updateField("price", e.target.value)}
								required
							/>
						</div>

						{/* O'qituvchi */}
						<div className="space-y-2">
							<Label className="text-zinc-400 font-medium ml-1 flex items-center gap-2">
								<FaChalkboardTeacher className="text-[10px]" /> Ustoz
							</Label>
							<Select
								value={String(formData.teacher_id)}
								onValueChange={(v) => updateField("teacher_id", v)}
								required
							>
								<SelectTrigger className="w-full bg-zinc-900 border-zinc-800 h-11">
									<SelectValue placeholder="Ustozni tanlang" />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
									{teachers.map((t) => (
										<SelectItem key={t.id} value={String(t.id)}>
											{t.full_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Xona */}
						<div className="space-y-2">
							<Label className="text-zinc-400 font-medium ml-1 flex items-center gap-2">
								<FaDoorOpen className="text-[10px]" /> Xona
							</Label>
							<Select
								value={String(formData.room_id)}
								onValueChange={(v) => updateField("room_id", v)}
								required
							>
								<SelectTrigger className="w-full bg-zinc-900 border-zinc-800 h-11">
									<SelectValue placeholder="Xonani tanlang" />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
									{rooms.map((r) => (
										<SelectItem key={r.room_id} value={String(r.room_id)}>
											{r.room_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Dars kunlari */}
						<div className="sm:col-span-2 space-y-3">
							<Label className="text-zinc-400 font-medium ml-1">
								Dars kunlari
							</Label>
							<div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
								{DAYS_OF_WEEK.map((day) => (
									<Button
										type="button"
										key={day}
										variant={
											formData.lesson_days?.includes(day)
												? "default"
												: "outline"
										}
										className={cn(
											"h-10 text-xs sm:text-sm font-semibold transition-all duration-200",
											formData.lesson_days?.includes(day)
												? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-yellow-600/20"
												: "border-zinc-800 hover:bg-zinc-800 text-zinc-400",
										)}
										onClick={() => toggleDay(day)}
									>
										{day}
									</Button>
								))}
							</div>
						</div>

						{/* Dars vaqti oralig'i */}
						<div className="sm:col-span-2 space-y-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-900">
							<Label className="text-zinc-400 font-medium flex items-center gap-2">
								<FaClock className="text-primary" /> Dars vaqti oralig'i
							</Label>
							<div className="flex items-center gap-4">
								<div className="flex-1 space-y-1">
									<span className="text-[10px] text-zinc-500 ml-1 uppercase">
										Boshlanish
									</span>
									<Input
										type="time"
										className="bg-zinc-900 border-zinc-800 text-white scheme-dark"
										value={formData.start_time}
										onChange={(e) => updateField("start_time", e.target.value)}
										required
									/>
								</div>
								<div className="mt-6 text-zinc-600">—</div>
								<div className="flex-1 space-y-1">
									<span className="text-[10px] text-zinc-500 ml-1 uppercase">
										Tugash
									</span>
									<Input
										type="time"
										className="bg-zinc-900 border-zinc-800 text-white scheme-dark"
										value={formData.end_time}
										onChange={(e) => updateField("end_time", e.target.value)}
										required
									/>
								</div>
							</div>
						</div>
					</div>

					<DialogFooter className="flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-zinc-800 mt-4">
						<Button
							type="button"
							variant="ghost"
							onClick={onClose}
							className="w-full sm:w-auto text-zinc-400 hover:text-white hover:bg-zinc-900"
						>
							Bekor qilish
						</Button>
						<Button
							type="submit"
							className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold px-8 shadow-lg shadow-yellow-600/20"
						>
							<FaSave className="mr-2" /> Saqlash
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
