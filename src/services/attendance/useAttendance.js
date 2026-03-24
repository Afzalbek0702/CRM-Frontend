import { useEffect, useState } from "react";
import { attendanceService } from "./attendanceService";
import toast from "react-hot-toast";

export const useAttendance = ({ group_id, month }) => {
	const [attendance, setAttendanceState] = useState([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	// Ma'lumotlarni yuklash
	useEffect(() => {
		const fetchAttendance = async () => {
			try {
				const response = await attendanceService.getAttendance(group_id, month);
				// Backenddan kelgan "success" o'ramini tekshiring (masalan response.data)
				setAttendanceState(response.data || response);
				setIsDirty(false);
			} catch (err) {
				console.error("Yuklashda xatolik:", err);
			}
		};
		if (group_id && month) fetchAttendance();
	}, [group_id, month]);

	// Faqat ekrandagi checkboxni o'zgartirish
	const updateLocalAttendance = (student_id, lesson_date, status) => {
		setIsDirty(true);
		setAttendanceState((prev) =>
			prev.map((student) => {
				if (student.student_id === student_id) {
					return {
						...student,
						days: student.days.map((day) =>
							day.date === lesson_date ? { ...day, status: status } : day,
						),
					};
				}
				return student;
			}),
		);
	};

	// Saqlash tugmasi bosilganda
	const saveAttendance = async () => {
		setIsSaving(true);

		const changedData = [];
		attendance.forEach((student) => {
			student.days.forEach((day) => {
				// null bo'lmagan barcha kunlarni massivga yig'amiz
				if (day.status !== null) {
					changedData.push({
						group_id: group_id,
						student_id: student.student_id,
						lesson_date: day.date,
						status: day.status, // Backend son kutsa 1/0
					});
				}
			});
		});

		if (changedData.length === 0) {
			toast.error("Hech qanday o'zgarish yo'q!");
			setIsSaving(false);
			return;
		}

		try {
			await attendanceService.setAttendance(changedData);
			setIsDirty(false);
			toast.success("Davomat saqlandi!");
		} catch (err) {
			console.error(err);
			toast.error("Saqlashda xatolik yuz berdi!");
		} finally {
			setIsSaving(false);
		}
	};

	return {
		attendance,
		updateLocalAttendance,
		saveAttendance,
		isSaving,
		isDirty,
	};
};
