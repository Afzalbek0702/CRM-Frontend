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
			const [group, students] = await Promise.all([
				groupsService.getById(id),
				groupsService.getStudentsInGroup(id),
			]);

			return { ...group, students };
		} catch (err) {
			console.error(err);
			throw err;
		}
	};

	const create = useMutation({
		mutationFn: (data) => groupsService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
			toast.success("Guruh muvaffaqiyatli qo'shildi");
		},
		onError: (err) => {
			toast.error("Guruh qo'shishda xatolik yuz berdi");
			console.error(err.response?.data);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => groupsService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
			toast.success("Guruh muvaffaqiyatli yangilandi");
		},
		onError: (error) => {
			toast.error("Guruhni yangilashda xatolik yuz berdi");
			console.error(error.response?.data);
		},
	});

	const deleteById = useMutation({
		mutationFn: (id) => groupsService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
			toast.success("Guruh muvaffaqiyatli o'chirildi");
		},
		onError: (err) => {
			toast.error("Guruhni o'chirishda xatolik yuz berdi");
			console.error(err.response);
		},
	});

	return {
		groups,
		loading: isLoading,
		error,
		fetchAll,
		fetchById,
		createGroup: create.mutate,
		updateGroup: update.mutate,
		deleteGroup: deleteById.mutate,

		isCreating: create.isPending,
		isUpdating: update.isPending,
		isDeleting: deleteById.isPending,
	};
};
