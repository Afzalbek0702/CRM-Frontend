import toast from "react-hot-toast";
import { roomService } from "./roomService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
const ROOM_KEY = ["room"];
export const useRoom = () => {
	const queryClient = useQueryClient();
	const {
		data: roomData = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ROOM_KEY,
		queryFn: () => roomService.get(),
	});

	const create = useMutation({
		mutationFn: (data) => roomService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ROOM_KEY });
			toast.success("Xona muvaffaqiyatli qo'shildi");
		},
		onError: (error) => {
			toast.error("Xona qo'shishda xatolik yuz berdi");
			console.error(error.response);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => roomService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ROOM_KEY });
			toast.success("Xona muvaffaqiyatli yangilandi");
		},
		onError: (error) => {
			toast.error("Xona yangilashda xatolik yuz berdi");
			console.error(error.response);
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => roomService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ROOM_KEY });
			toast.success("Xona muvaffaqiyatli o'chirildi");
		},
		onError: (error) => {
			console.error(error.response);
			toast.error("Xona o'chirishda xatolik yuz berdi");
		},
	});

	return {
		roomData,
		isLoading,
		error,

		createRoom: create.mutate,
		updateRoom: update.mutate,
		removeRoom: deleteById.mutate,
	};
};
