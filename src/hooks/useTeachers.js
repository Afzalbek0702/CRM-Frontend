import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../services/teacher-service";

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
         queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
      },
   });
   const updateTeacherMutation = useMutation({
      mutationFn: ({id, data}) => teacherService.update(id, data).then((res) => res.data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
      },
   });
   const deleteTeacherMutation = useMutation({
      mutationFn: (id) => teacherService.delete(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
      },
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