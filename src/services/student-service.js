import api from "./api";
import { endpoints } from "./endpoints";

export const studentService = {
	getAll: () => api.get(endpoints.STUDENTS),
	getById: (id) => api.get(`${endpoints.STUDENTS}/${id}`),
	create: (data) => api.post(endpoints.STUDENTS, data),
	update: (id, data) => api.put(`${endpoints.STUDENTS}/${id}`, data),
	updateStatus: (id, status) =>
		api.patch(`${endpoints.STUDENTS}/${id}/status`, { status }),
	delete: (id) => api.delete(`${endpoints.STUDENTS}/${id}`),
	addToGroup: (studentId, groupId) =>
		api.post(endpoints.ENROLLMENTS, {
			student_id: studentId,
			group_id: groupId,
		}),
	removeFromGroup: (studentId, groupId) =>
		api.post(`${endpoints.STUDENTS}/${studentId}/remove-from-group`,{groupId}),
	transferToGroup: (student_id, from_group_id, to_group_id) =>
		api.post(
			`${endpoints.STUDENTS}/${student_id}/transfer`,
			student_id,
			from_group_id,
			to_group_id,
		),
};
