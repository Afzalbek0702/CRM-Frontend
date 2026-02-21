import { useQuery } from "@tanstack/react-query";
import { archiveService } from "./archiveService.js";

const ARCHIVE_QUERY_KEY = "archive";

export const useArchive = () => {
	const {
		data: archivedGroups = [],
		isLoading,
		error,
		refetch: fetchAll,
	} = useQuery({
		queryKey: [ARCHIVE_QUERY_KEY],
		queryFn: () => archiveService.getArchivedGroups(),
	});

	const useGetArchivedGroupById = (id) =>
		useQuery({
			queryKey: [ARCHIVE_QUERY_KEY, "group", id],
			queryFn: async () => {
				const [groupRes, studentsRes] = await Promise.all([
					archiveService.getArchivedGroupById(id),
					archiveService.getAllArchivedGroupsStudents(id),
				]);

				return { ...groupRes.data, students: studentsRes.data };
			},
			enabled: !!id,
		});

	const useAllArchivedLeads = () =>
		useQuery({
			queryKey: [ARCHIVE_QUERY_KEY, "leads"],
			queryFn: () => archiveService.getAllArchivedLeads(),
		});

	const useAllArchivedStudents = () =>
		useQuery({
			queryKey: [ARCHIVE_QUERY_KEY, "teachers"],
			queryFn: () => archiveService.getAllArchivedStudents(),
		});
	const useAllArchivedTeachers = () =>
		useQuery({
			queryKey: [ARCHIVE_QUERY_KEY, "students"],
			queryFn: () => archiveService.getAllArchivedTeachers(),
		});
	const useAllArchivedPayments = () =>
		useQuery({
			queryKey: [ARCHIVE_QUERY_KEY, "payments"],
			queryFn: () => archiveService.getAllArchivedPayments(),
		});

	return {
		archivedGroups,
		isLoading,
		error,
		fetchAll,

		useGetArchivedGroupById,
		useAllArchivedLeads,
		useAllArchivedStudents,
		useAllArchivedPayments,
		useAllArchivedTeachers,
	};
};
