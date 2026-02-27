import toast from "react-hot-toast";
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
			toast.success("Xarajat muvaffaqiyatli qo'shildi");
		},
		onError: (error) => {
			toast.error("Xarajat qo'shishda xatolik yuz berdi");
			console.error(error.response);
		},
	});

	const updateExpense = useMutation({
		mutationFn: ({ id, data }) => expenseService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EXPENSE_KEY });
			toast.success("Xarajat muvaffaqiyatli yangilandi");
		},
		onError: (error) => {
			console.error(error.response);
			toast.error("Xarajat yangilashda xatolik yuz berdi");
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => expenseService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EXPENSE_KEY });
			toast.success("Xarajat muvaffaqiyatli o'chirildi");
		},
		onError: (error) => {
			toast.error("Xarajat o'chirishda xatolik yuz berdi");
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
