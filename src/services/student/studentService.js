import api from "../api/apiClient";
import { endpoints } from "../api/endpoints";

export const studentService = {
	getAll: () => api.get(endpoints.STUDENTS).then((r) => r.data),

	getById: (id) => api.get(`${endpoints.STUDENTS}/${id}`).then((r) => r.data),

	create: (data) => api.post(endpoints.STUDENTS, data).then((r) => r.data),

	update: (id, data) =>
		api.put(`${endpoints.STUDENTS}/${id}`, data).then((r) => r.data),

	updateStatus: (id, status) =>
		api
			.patch(`${endpoints.STUDENTS}/${id}/status`, { status })
			.then((r) => r.data),

	delete: (id) => api.delete(`${endpoints.STUDENTS}/${id}`).then((r) => r.data),

	addToGroup: (studentId, groupId) =>
		api
			.post(endpoints.ENROLLMENTS, {
				student_id: studentId,
				group_id: groupId,
			})
			.then((r) => r.data),

	removeFromGroup: (studentId, groupId) =>
		api
			.post(`${endpoints.STUDENTS}/${studentId}/remove-from-group`, {
				groupId,
			})
			.then((r) => r.data),

	transferToGroup: (student_id, from_group_id, to_group_id) =>
		api
			.post(`${endpoints.STUDENTS}/${student_id}/transfer`, {
				student_id,
				from_group_id,
				to_group_id,
			})
			.then((r) => r.data),
};
