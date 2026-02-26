import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "./teacherService";
import toast from "react-hot-toast";

export const useTeachers = () => {
	const TEACHERS_QUERY_KEY = ["teachers"];
	const queryClient = useQueryClient();
	const {
		data: teachers = [],
		isLoading,
		error,
		refetch: fetchAll,
	} = useQuery({
		queryKey: TEACHERS_QUERY_KEY,
		queryFn: () => teacherService.getAll(),
	});

	const fetchById = async (id) => {
		const response = await teacherService.getById(id);
		return response.data;
	};

	const createTeacherMutation = useMutation({
		mutationFn: (data) => teacherService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });
			toast.success("O'qituvchi muvaffaqiyatli qo'shildi");
		},
		onError: (error) => {
			toast.error("O'qituvchi qo'shishda xatolik yuz berdi");
			console.error(error.response?.data);
		},
	});
	const updateTeacherMutation = useMutation({
		mutationFn: ({ id, data }) => teacherService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });
			toast.success("O'qituvchi muvaffaqiyatli yangilandi");
		},
		onError: (error) => {
			toast.error("O'qituvchi yangilashda xatolik yuz berdi");
			console.error(error.response?.data);
		},
	});
	const deleteTeacherMutation = useMutation({
		mutationFn: (id) => teacherService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });
			toast.success("O'qituvchi muvaffaqiyatli o'chirildi");
		},
		onError: (error) => {
			toast.error("O'qituvchi o'chirishda xatolik yuz berdi");
			console.error(error.response?.data);
		},
	});

	return {
		teachers,
		isLoading,
		error,
		fetchAll,
		fetchById,
		createTeacher: createTeacherMutation.mutate,
		updateTeacher: updateTeacherMutation.mutate,
		deleteTeacher: deleteTeacherMutation.mutate,
	};
};
