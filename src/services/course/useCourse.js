import { courseService } from "./courseService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
const COURSE_KEY = ["course"];
export const useCourse = () => {
	const queryClient = useQueryClient();
	const {
		data: courseData = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: COURSE_KEY,
		queryFn: () => courseService.get(),
	});

	const create = useMutation({
		mutationFn: (data) => courseService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: COURSE_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }) => courseService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: COURSE_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});
	const deleteById = useMutation({
		mutationFn: (id) => courseService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: COURSE_KEY });
		},
		onError: (error) => {
			console.error(error.response);
		},
	});

	return {
		courseData,
		isLoading,
		error,

		createCourse: create.mutateAsync,
		updateCourse: update.mutateAsync,
		removeCourse: deleteById.mutateAsync,
	};
};
