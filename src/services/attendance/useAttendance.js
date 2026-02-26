import { useState, useEffect } from "react";
import { attendanceService } from "./attendanceService";

export const useAttendance = ({ group_id, month }) => {
	const [attendance, setAttendanceState] = useState([]);

	useEffect(() => {
		const fetchAttendance = async () => {
			try {
				const data = await attendanceService.getAttendance(group_id, month);
				setAttendanceState(data);
			} catch (err) {
				console.error("Failed to fetch attendance", err);
			}
		};

		fetchAttendance();
	}, [group_id, month]);

	const setAttendance = (data) => {
		return attendanceService.setAttendance(data);
	};

	return {
		attendance,
		setAttendance,
	};
};
