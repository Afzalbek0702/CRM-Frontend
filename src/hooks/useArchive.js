import { useQuery } from "@tanstack/react-query";
import { archiveService } from "../services/archive-service.js";

const ARCHIVE_QUERY_KEY = "archive";

export const useArchive = () => {
	const {
		data: archivedGroups = [],
		isLoading,
		error,
		refetch: fetchAll,
	} = useQuery({
		queryKey: [ARCHIVE_QUERY_KEY],
		queryFn: () => archiveService.getArchivedGroups().then((res) => res.data),
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});

	const useGetArchivedGroupById = (id) =>
		useQuery({
			queryKey: [ARCHIVE_QUERY_KEY, "group", id],
			queryFn: async () => {
				const groupRes = await archiveService.getArchivedGroupById(id);
				const studentsRes = await archiveService.getAllArchivedGroupsStudents(id);
				return { ...groupRes.data, students: studentsRes.data };
			},
			enabled: !!id, // faqat id mavjud bo'lsa so'rov yuborilsin
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		});

	const useAllArchivedLeads = () =>
		useQuery({
			queryKey: [ARCHIVE_QUERY_KEY, "leads"],
			queryFn: () => archiveService.getAllArchivedLeads().then((res) => res.data),
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		});

	const useAllArchivedStudents = () =>
		useQuery({
			queryKey: [ARCHIVE_QUERY_KEY, "students"],
			queryFn: () => archiveService.getAllArchivedStudents().then((res) => res.data),
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		});

	const useAllArchivedPayments = () =>
		useQuery({
			queryKey: [ARCHIVE_QUERY_KEY, "payments"],
			queryFn: () => archiveService.getAllArchivedPayments().then((res) => res.data),
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
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
	};
};