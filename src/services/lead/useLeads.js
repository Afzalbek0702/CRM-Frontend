import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsService } from "./leadService.js";

const LEADS_QUERY_KEY = ["leads"];

export const useLeads = () => {
	const queryClient = useQueryClient();
	const {
		data: leads = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: LEADS_QUERY_KEY,
		queryFn: () => leadsService.getLeads(),
	});
	const fetchById = async (id) => {
		const response = await leadsService.getLeadById(id);
		return response.data;
	};

	const createLeadMutation = useMutation({
		mutationFn: (data) => leadsService.createLead(data),
		onSuccess: () => {
			toast.success("Lead muffafaqqiyatli yaratildi");
			queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
		},
		onError: (error) => {
			toast.error("Lead yaratishda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	const updateLeadMutation = useMutation({
		mutationFn: ({ id, data }) => leadsService.updateLead(id, data),
		onSuccess: () => {
			toast.success("Lead muffafaqqiyatli yangilandi");
			queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
		},
		onError: (error) => {
			toast.error("Lead yangilashda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	const deleteLeadMutation = useMutation({
		mutationFn: (id) => leadsService.deleteLead(id),
		onSuccess: () => {
			toast.success("Lead muffafaqqiyatli o'chirildi");
			queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
		},
		onError: (error) => {
			toast.error("Leadni o'chirishda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});
	const convertLeadToGroupMutation = useMutation({
		mutationFn: ({ id, group_id }) =>
			leadsService.convertLeadToGroup(id, group_id),
		onSuccess: () => {
			toast.success("Lead muffafaqqiyatli guruhga qo'shildi");
			queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
		},
		onError: (error) => {
			toast.error("Leadni guruhga qo'shishda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});
	return {
		leads,
		isLoading,
      error,
      fetchById,
		createLead: createLeadMutation.mutate,
		updateLead: updateLeadMutation.mutate,
		deleteLead: deleteLeadMutation.mutate,
		convertLeadToGroup: convertLeadToGroupMutation.mutate,
	};
};
