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
		},
		onError: (err) => {
			console.error(err.response?.data.message);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => groupsService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});

	const deleteById = useMutation({
		mutationFn: (id) => groupsService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
		},
		onError: (err) => {
			console.error(err.response);
		},
	});

	return {
		groups,
		loading: isLoading,
		error,
		fetchAll,
		fetchById,
		createGroup: create.mutateAsync,
		updateGroup: update.mutateAsync,
		deleteGroup: deleteById.mutateAsync,

		isCreating: create.isPending,
		isUpdating: update.isPending,
		isDeleting: deleteById.isPending,
	};
};
