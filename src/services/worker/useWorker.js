import { workerService } from "./workerService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/authContext";
const WORKER_KEY = ["worker"];
export const useWorker = () => {
   const { user } = useAuth();
	const queryClient = useQueryClient();
	const {
		data: workerData = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: WORKER_KEY,
		queryFn: () => workerService.get(),
		enabled: user?.role !== "TEACHER",
	});

	const create = useMutation({
		mutationFn: (data) => workerService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKER_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => workerService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKER_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => workerService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKER_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	return {
		workerData,
		isLoading,
		error,
		createWorker: create.mutateAsync,
		updateWorker: update.mutateAsync,
		removeWorker: deleteById.mutateAsync,
	};
};
