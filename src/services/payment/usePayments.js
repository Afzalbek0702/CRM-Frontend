import toast from "react-hot-toast";
import { paymentService } from "./paymentService.js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
const PAYMENTS_KEY = ["payments"];
export const usePayments = () => {
	const queryClient = useQueryClient();
	const {
		data: payments = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: PAYMENTS_KEY,
		queryFn: () => paymentService.getAll(),
	});
	

	const createPaymentMutation = useMutation({
		mutationFn: data => paymentService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
			toast.success("To'lov muvaffaqiyatli qo'shildi");
		},
		onError: error => {
			toast.error("To'lov qo'shishda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	const updatePaymentMutation = useMutation({
		mutationFn: ({ id, data }) => paymentService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
			toast.success("To'lov muvaffaqiyatli yangilandi");
		},
		onError: error => {
			toast.error("To'lov yangilashda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	const deletePaymentMutation = useMutation({
		mutationFn: id => paymentService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
			toast.success("To'lov muvaffaqiyatli o'chirildi");
		},
		onError: error => {
			toast.error("To'lovni o'chirishda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	return {
		payments,
		isLoading,
		error,
		createPayment: createPaymentMutation.mutate,
		updatePayment: updatePaymentMutation.mutate,
		deletePayment: deletePaymentMutation.mutate,
	};
};
