import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsService } from "./leadService.js";
import { useAuth } from "@/context/authContext.jsx";

const LEADS_QUERY_KEY = ["leads"];

export const useLeads = () => {
   const { user } = useAuth();
	const queryClient = useQueryClient();
	const {
		data: leads = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: LEADS_QUERY_KEY,
		queryFn: () => leadsService.getLeads(),
		enabled: user?.role !== "TEACHER",
	});
	const fetchById = async (id) => {
		const response = await leadsService.getLeadById(id);
		return response.data;
	};

	const createLeadMutation = useMutation({
		mutationFn: (data) => leadsService.createLead(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});

	const updateLeadMutation = useMutation({
		mutationFn: ({ id, data }) => leadsService.updateLead(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});

	const deleteLeadMutation = useMutation({
		mutationFn: (id) => leadsService.deleteLead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});
	const convertLeadToGroupMutation = useMutation({
		mutationFn: ({ id, group_id }) =>
         leadsService.convertLeadToGroup(id, group_id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});
	const convertLeadToStudentMutation = useMutation({
		mutationFn: (id) =>
         leadsService.convertLeadToStudent(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});
	return {
		leads,
		isLoading,
		error,
		fetchById,
		createLead: createLeadMutation.mutateAsync,
		updateLead: updateLeadMutation.mutateAsync,
		deleteLead: deleteLeadMutation.mutateAsync,
		convertLeadToGroup: convertLeadToGroupMutation.mutateAsync,
		convertLeadToStudent: convertLeadToStudentMutation.mutateAsync,
	};
};
