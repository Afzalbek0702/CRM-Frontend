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
			queryClient.invalidateQueries({ queryKey: WORKER_KEY });
			toast.success("Ishchi muvaffaqiyatli qo'shildi");
		},
		onError: (error) => {
			toast.error("Ishchi qo'shishda xatolik yuz berdi");
			console.error(error.response);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => workerService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKER_KEY });
			toast.success("Ishchi muvaffaqiyatli yangilandi");
		},
		onError: (error) => {
			toast.error("Ishchi yangilashda xatolik yuz berdi");
			console.error(error.response);
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => workerService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKER_KEY });
			toast.success("Ishchi muvaffaqiyatli o'chirildi");
		},
		onError: (error) => {
			toast.error("Ishchi o'chirishda xatolik yuz berdi");
			console.error(error.response);
		},
	});

	return {
		workerData,
		isLoading,
		error,
		createWorker: create.mutate,
		updateWorker: update.mutate,
		removeWorker: deleteById.mutate,
	};
};
