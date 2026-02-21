import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";

export const attendanceService = {
	getAttendance: (group_id, month) =>
		api
			.get(endpoints.ATTENDANCE, { params: { group_id, month } })
			.then((r) => r.data),
	setAttendance: (data) =>
		api.post(endpoints.ATTENDANCE, data).then((r) => r.data),
};
