import toast from "react-hot-toast";
import { workerService } from "./workerService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
const WORKER_KEY = ["worker"];
export const useWorker = () => {
	const queryClient = useQueryClient();
	const {
		data: workerData = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: WORKER_KEY,
		queryFn: () => workerService.get(),
	});

	const create = useMutation({
		mutationFn: (data) => workerService.create(data),
		onSuccess: () => {
			toast.success("");
			queryClient.invalidateQueries({ queryKey: WORKER_KEY });
		},
		onError: (error) => {
			toast.error("");
			console.error(error.response);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => workerService.update(id, data),
		onSuccess: () => {
			toast.success("");
			queryClient.invalidateQueries({ queryKey: WORKER_KEY });
		},
		onError: (error) => {
			toast.error("");
			console.error(error.response);
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => workerService.delete(id),
		onSuccess: () => {
			toast.success("");
			queryClient.invalidateQueries({ queryKey: WORKER_KEY });
		},
		onError: (error) => {
			toast.error("");
			console.error(error.response);
		},
	});

	return {
		workerData,
		isLoading,
		error,

		create: create.mutate,
		update: update.mutate,
		delete: deleteById.mutate,
	};
};
