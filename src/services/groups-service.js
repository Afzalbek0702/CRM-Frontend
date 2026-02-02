import api from "./api";
import { endpoints } from "./endpoints";

export const groupsService = {
	getAll:  (params) =>  api.get(endpoints.GROUPS, { params }),
	getById:  (id) =>  api.get(`${endpoints.GROUPS}/${id}`),
	getStudentsInGroup:  (id) =>  api.get(`${endpoints.GROUPS}/${id}/students`),
	create:  (data) =>  api.post(endpoints.GROUPS, data),
	update:  (id, data) =>  api.put(`${endpoints.GROUPS}/${id}`, data),
	delete:  (id) =>  api.delete(`${endpoints.GROUPS}/${id}`),
};