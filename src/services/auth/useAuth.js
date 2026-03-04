import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import toast from "react-hot-toast";

export const useAuth = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: (credentials) => authService.login(credentials),

		onSuccess: (data) => {
			const { tenant, user } = data;
         console.log("tenant",tenant);
         
			localStorage.setItem("tenant", tenant);
			localStorage.setItem("user", JSON.stringify(user));

			queryClient.setQueryData(["user"], user);

			navigate(`/${tenant}/dashboard`);
		},

		onError: (error) => {
			console.error("Login xatosi:", error);
			toast.error("Telefon raqam yoki parol noto'g'ri!");
		},
	});

	return {
		login: mutation.mutate,
		isLoading: mutation.isLoading,
		isError: mutation.isError,
		error: mutation.error,
	};
};
