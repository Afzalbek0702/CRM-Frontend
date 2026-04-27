import { expenseService } from "./expenseService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
const EXPENSE_KEY = ["expense"];
export const useExpenses = () => {
	const queryClient = useQueryClient();
	const {
		data: expense = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: EXPENSE_KEY,
		queryFn: () => expenseService.get(),
	});

	const createExpense = useMutation({
		mutationFn: (data) => expenseService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EXPENSE_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	const updateExpense = useMutation({
		mutationFn: ({ id, data }) => expenseService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EXPENSE_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => expenseService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EXPENSE_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	return {
    expenses: expense,   
    isLoading,
    error,

    createExpense: createExpense.mutateAsync,
    updateExpense: updateExpense.mutateAsync,
    deleteExpense: deleteById.mutateAsync,
};
};
