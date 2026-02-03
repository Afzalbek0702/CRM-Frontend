import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../services/teacher-service";
import toast from "react-hot-toast";

export const useTeachers = () => {
	const TEACHERS_QUERY_KEY = "teachers";
	const queryClient = useQueryClient();
	const {
		data: teachers = [],
		isLoading,
		error,
		refetch: fetchAll,
	} = useQuery({
		queryKey: [TEACHERS_QUERY_KEY],
		queryFn: () => teacherService.getAll().then((res) => res.data),
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
   });
   
   const fetchById = async (id) => {
      const response = await teacherService.getById(id);
      return response.data;
   };

   const createTeacherMutation = useMutation({
			mutationFn: (data) => teacherService.create(data).then((res) => res.data),
			onSuccess: () => {
				toast.success("O'qituvchi muvaffaqiyatli qo'shildi");
				queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
			},
			onError: (error) => {
				toast.error("O'qituvchi qo'shishda xatolik yuz berdi");
				console.log(error.response?.data);
			},
		});
   const updateTeacherMutation = useMutation({
			mutationFn: ({ id, data }) =>
				teacherService.update(id, data).then((res) => res.data),
			onSuccess: () => {
				toast.success("O'qituvchi muvaffaqiyatli yangilandi");
				queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
			},
			onError: (error) => {
				toast.error("O'qituvchi yangilashda xatolik yuz berdi");
				console.log(error.response?.data);
			},
		});
   const deleteTeacherMutation = useMutation({
      mutationFn: (id) => teacherService.delete(id),
      onSuccess: () => {
         toast.success("O'qituvchi muvaffaqiyatli o'chirildi")
         queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
      },
      onError: (error) => {
         toast.error("O'qituvchi o'chirishda xatolik yuz berdi");
         console.log(error.response?.data);
      }
   });

   return {
      teachers,
      isLoading,
      error,
      fetchAll,
      fetchById,
      createTeacher: createTeacherMutation.mutateAsync,
      updateTeacher: (id, data) => updateTeacherMutation.mutateAsync({ id, data }),
      deleteTeacher: deleteTeacherMutation.mutateAsync,
   };
};