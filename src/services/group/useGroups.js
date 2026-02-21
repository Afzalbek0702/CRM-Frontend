import toast from "react-hot-toast";
import { groupsService } from "./groupsService.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const GROUPS_QUERY_KEY = ["groups"];

export const useGroups = () => {
	const queryClient = useQueryClient();
	const {
		data: groups = [],
		isLoading,
		error,
		refetch: fetchAll,
	} = useQuery({
		queryKey: GROUPS_QUERY_KEY,
		queryFn: () => groupsService.getAll(),
	});

	const fetchById = async (id) => {
		try {
			const [groupRes, studentsRes] = await Promise.all([
				groupsService.getById(id),
				groupsService.getStudentsInGroup(id),
			]);
			return { ...groupRes.data, students: studentsRes.data };
		} catch (err) {
			console.error(err);
			throw err;
		}
	};

	const createGroupMutation = useMutation({
		mutationFn: (data) => groupsService.create(data),
		onMutate: async (newGroup) => {
			// Bekor qilish
			await queryClient.cancelQueries({ queryKey: GROUPS_QUERY_KEY });
			const previousGroups = queryClient.getQueryData(GROUPS_QUERY_KEY);

			// Optimistik yangilash
			queryClient.setQueryData([GROUPS_QUERY_KEY], (old) => [
				...(old || []),
				{ ...newGroup, id: "optimistic-" + Date.now(), isOptimistic: true },
			]);

			return { previousGroups };
		},
		onSuccess: () => {
			toast.success("Guruh muvaffaqiyatli qo'shildi");
		},
		onError: (err, newGroup, context) => {
			toast.error("Guruh qo'shishda xatolik yuz berdi");
			console.log(err.response?.data);
			// Xatolik bo'lsa, eski holatni qaytarish
			queryClient.setQueryData(GROUPS_QUERY_KEY, context.previousGroups);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
		},
	});

	// 4. UPDATE
	const updateGroupMutation = useMutation({
		mutationFn: ({ id, data }) => groupsService.update(id, data),
		onSuccess: () => {
			toast.success("Guruh muvaffaqiyatli yangilandi");
			queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
		},
		onError: (error) => {
			toast.error("Guruhni yangilashda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	const deleteGroupMutation = useMutation({
		mutationFn: (id) => groupsService.delete(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: GROUPS_QUERY_KEY });
			const previousGroups = queryClient.getQueryData(GROUPS_QUERY_KEY);

			queryClient.setQueryData(GROUPS_QUERY_KEY, (old) =>
				(old || []).filter((group) => group.id !== id),
			);

			return { previousGroups };
		},
		onSuccess: () => {
			toast.success("Guruh muvaffaqiyatli o'chirildi");
		},
		onError: (err, id, context) => {
			toast.error("Guruhni o'chirishda xatolik yuz berdi");
			console.log(err.response?.data);
			queryClient.setQueryData(GROUPS_QUERY_KEY, context.previousGroups);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
		},
	});

	return {
		groups,
		loading: isLoading,
		error,
		fetchAll,
		fetchById,
		createGroup: createGroupMutation.mutate,
		updateGroup: (id, data) => updateGroupMutation.mutate({ id, data }),
		deleteGroup: deleteGroupMutation.mutate,

		isCreating: createGroupMutation.isPending,
		isUpdating: updateGroupMutation.isPending,
		isDeleting: deleteGroupMutation.isPending,
	};
};
