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
		},
		onError: error => {
			console.log(error.response?.data);
		},
	});

	const updatePaymentMutation = useMutation({
		mutationFn: ({ id, data }) => paymentService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
		},
		onError: error => {
			console.log(error.response?.data);
		},
	});

	const deletePaymentMutation = useMutation({
		mutationFn: id => paymentService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
		},
		onError: error => {
			console.log(error.response?.data);
		},
	});

	return {
		payments,
		isLoading,
		error,
		createPayment: createPaymentMutation.mutateAsync,
		updatePayment: updatePaymentMutation.mutateAsync,
		deletePayment: deletePaymentMutation.mutateAsync,
	};
};
