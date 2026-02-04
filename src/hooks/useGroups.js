import toast from "react-hot-toast";
import { groupsService } from "../services/groups-service.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const GROUPS_QUERY_KEY = "groups";
export const useGroups = () => {
	const queryClient = useQueryClient();
	const {
		data: groups = [],
		isLoading,
		error,
		refetch: fetchAll,
	} = useQuery({
		queryKey: [GROUPS_QUERY_KEY],
		queryFn: () => groupsService.getAll().then((res) => res.data),
		staleTime: 5 * 60 * 1000, 
		refetchOnWindowFocus: false, 
	});

	const fetchById = async (id) => {
      const groups = await groupsService.getById(id);
      const students = await groupsService.getStudentsInGroup(id);
		return { ...groups.data, students: students.data };
	};

	const createGroupMutation = useMutation({
		mutationFn: (data) => groupsService.create(data).then((res) => res.data),
      onMutate: async (newGroup) => {
         toast.success("Guruh muvaffaqiyatli qo'shildi")
			await queryClient.cancelQueries({ queryKey: [GROUPS_QUERY_KEY] });
			const previousGroups = queryClient.getQueryData([GROUPS_QUERY_KEY]);
		
			queryClient.setQueryData([GROUPS_QUERY_KEY], (old) => [
				...(old || []),
				{ ...newGroup, id: Date.now() }, 
			]);

			return { previousGroups };
		},
      onError: (err, newGroup, context) => {
         toast.error("Guruh qo'shishda xatolik yuz berdi")
         console.log(err.response?.data);
			
			queryClient.setQueryData([GROUPS_QUERY_KEY], context.previousGroups);
		},
		onSettled: () => {
			
			queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
		},
	});


	const updateGroupMutation = useMutation({
		mutationFn: ({ id, data }) =>
			groupsService.update(id, data).then((res) => res.data),
		onSuccess: () => {
			toast.success("Guruh muvaffaqiyatli yangilandi");
			queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
		},
		onError: (error) => {
			toast.error("Guruhni yangilashda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	const deleteGroupMutation = useMutation({
		mutationFn: (id) => groupsService.delete(id),
      onMutate: async (id) => {
         toast.success("Guruh muvaffaqiyatli o'chirildi")
			await queryClient.cancelQueries({ queryKey: [GROUPS_QUERY_KEY] });
			const previousGroups = queryClient.getQueryData([GROUPS_QUERY_KEY]);

			queryClient.setQueryData([GROUPS_QUERY_KEY], (old) =>
				(old || []).filter((group) => group.id !== id),
			);

			return { previousGroups };
		},
      onError: (err, id, context) => {
         toast.error("Guruhni o'chirishda xatolik yuz berdi")
         console.log(err.response?.data);
			queryClient.setQueryData([GROUPS_QUERY_KEY], context.previousGroups);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
		},
	});

	return {
		groups,
		loading: isLoading,
		error,
		fetchAll,
		fetchById,
		createGroup: createGroupMutation.mutate,
		updateGroup: (id, data) => updateGroupMutation.mutate({id, data}),
		deleteGroup: deleteGroupMutation.mutate,
	};
};