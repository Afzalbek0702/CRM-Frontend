import toast from "react-hot-toast";
import { salaryService } from "./salaryService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
const SALARY_KEY = ["salary"];
export const useSalary = () => {
	const queryClient = useQueryClient();
	const {
		data: salary = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: SALARY_KEY,
		queryFn: () => salaryService.get(),
	});

	const create = useMutation({
		mutationFn: (data) => salaryService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SALARY_KEY });
			toast.success("Maosh muvaffaqiyatli qo'shildi");
		},
		onError: (error) => {
			toast.error("Maosh qo'shishda xatolik yuz berdi");
			console.error(error.response);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => salaryService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SALARY_KEY });
			toast.success("Maosh muvaffaqiyatli yangilandi");
		},
		onError: (error) => {
			toast.error("Maosh yangilashda xatolik yuz berdi");
			console.error(error.response);
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => salaryService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SALARY_KEY });
			toast.success("Maosh muvaffaqiyatli o'chirildi");
		},
		onError: (error) => {
			toast.error("Maosh o'chirishda xatolik yuz berdi");
			console.error(error.response);
		},
	});

	return {
		salary,
		isLoading,
		error,

		createSalary: create.mutate,
		updateSalary: update.mutate,
		removeSalary: deleteById.mutate,
	};
};
