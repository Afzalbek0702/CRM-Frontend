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
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => salaryService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SALARY_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => salaryService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SALARY_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	return {
		salary,
		isLoading,
		error,

		createSalary: create.mutateAsync,
		updateSalary: update.mutateAsync,
		removeSalary: deleteById.mutateAsync,
	};
};
