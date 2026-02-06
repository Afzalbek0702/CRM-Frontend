import api from './api';
import {endpoints} from './endpoints';
export const archiveService = {
	getArchivedGroups: async () => await api.get(`${endpoints.ARCHIVE}/groups`),
	getArchivedGroupById: async (id) =>
		await api.get(`${endpoints.ARCHIVE}/groups/${id}`),
	getAllArchivedPayments: async () =>
		await api.get(`${endpoints.ARCHIVE}/payments`),
	getAllArchivedLeads: async () => await api.get(`${endpoints.ARCHIVE}/leads`),
	getAllArchivedGroupsStudents: async () => await api.get(`${endpoints.ARCHIVE}/group-students`),
	getAllArchivedStudents: async () => await api.get(`${endpoints.ARCHIVE}/students`),
};