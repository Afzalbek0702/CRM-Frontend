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
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => roomService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ROOM_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => roomService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ROOM_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	return {
		roomData,
		isLoading,
		error,

		createRoom: create.mutateAsync,
		updateRoom: update.mutateAsync,
		removeRoom: deleteById.mutateAsync,
	};
};
