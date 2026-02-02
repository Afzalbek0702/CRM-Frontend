import toast from "react-hot-toast";
import {paymentService} from "../services/payment-service.js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
const PAYMENTS_KEY = "payments";
export const usePayments = () => {
	const queryClient = useQueryClient();
	const {
		data: payments = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: [PAYMENTS_KEY],
		queryFn: () => paymentService.getAll().then((res) => res.data),
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});

	const createPaymentMutation = useMutation({
		mutationFn: (data) => paymentService.create(data).then((res) => res.data),
      onSuccess: () => {
         toast.success("To'lov muvaffaqiyatli qo'shildi")
			queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
		},
	});

	const updatePaymentMutation = useMutation({
		mutationFn: ({ id, data }) => paymentService.update(id, data).then((res) => res.data),
      onSuccess: () => {
         toast.success("To'lov muvaffaqiyatli yangilandi")
			queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
		},
	});

	const deletePaymentMutation = useMutation({
		mutationFn: (id) => paymentService.delete(id),
      onSuccess: () => {
         toast.success("To'lov muvaffaqiyatli o'chirildi")
			queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
		},
	});

	return {
		payments,
		isLoading,
		error,
		createPayment: createPaymentMutation.mutateAsync,
		updatePayment: (id, data) => updatePaymentMutation.mutateAsync({ id, data }),
		deletePayment: deletePaymentMutation.mutateAsync,
	};
};
