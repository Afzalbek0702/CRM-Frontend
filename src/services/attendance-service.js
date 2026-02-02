import api from "./api.js";
import { endpoints } from "./endpoints.js";

export const attendanceService = {
	getAttendance: (group_id, month) =>
		api.get(endpoints.ATTENDANCE, { params: { group_id, month } }),
	setAttendance: (data) => api.post(endpoints.ATTENDANCE, data),
};
