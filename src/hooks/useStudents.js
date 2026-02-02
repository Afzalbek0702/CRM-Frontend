import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../services/student-service.js";

const STUDENTS_QUERY_KEY = "students";

export const useStudents = () => {
	const queryClient = useQueryClient();
	// 1. Barcha talabalarni yuklash (avtomatik)
	const {
		data: students = [],
		isLoading,
		error,
		refetch: fetchAll,
	} = useQuery({
		queryKey: [STUDENTS_QUERY_KEY],
		queryFn: () => studentService.getAll().then((res) => res.data),
		staleTime: 5 * 60 * 1000, // 5 daqiqa cache
		refetchOnWindowFocus: false,
	});

	// 2. Bitta talabani ID bo'yicha olish
	const fetchById = async (id) => {
		const response = await studentService.getById(id);
		return response.data;
	};

	// 3. Yangi talaba qo'shish
	const createStudentMutation = useMutation({
		mutationFn: (data) => studentService.create(data).then((res) => res.data),
		onMutate: async (newStudent) => {
			// Optimistik yangilanish: dastlabki ma'lumotlarni saqlash
			await queryClient.cancelQueries({ queryKey: [STUDENTS_QUERY_KEY] });
			const previousStudents = queryClient.getQueryData([STUDENTS_QUERY_KEY]);

			// Yangi talabani cache ga qo'shish
			queryClient.setQueryData([STUDENTS_QUERY_KEY], (old) => [
				...(old || []),
				{ ...newStudent, id: Date.now() }, // id serverdan kelguncha vaqtinchalik
			]);

			return { previousStudents };
		},
		onError: (err, newStudent, context) => {
			// Xatolikda eski holatga qaytarish
			queryClient.setQueryData([STUDENTS_QUERY_KEY], context.previousStudents);
		},
		onSettled: () => {
			// Muvaffaqiyatli yoki xatolik — har ikkala holatda ham yangilash
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
	});

	// 4. Talabani tahrirlash
	const updateStudentMutation = useMutation({
		mutationFn: ({ id, data }) =>
			studentService.update(id, data).then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
	});

	// 5. Talaba statusini yangilash
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }) =>
			studentService.updateStatus(id, status).then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
	});

	// 6. Talabani o'chirish
	const deleteStudentMutation = useMutation({
		mutationFn: (id) => studentService.delete(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: [STUDENTS_QUERY_KEY] });
			const previousStudents = queryClient.getQueryData([STUDENTS_QUERY_KEY]);

			queryClient.setQueryData([STUDENTS_QUERY_KEY], (old) =>
				(old || []).filter((student) => student.id !== id),
			);

			return { previousStudents };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData([STUDENTS_QUERY_KEY], context.previousStudents);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
	});

	// 7. Talabani guruhga qo'shish
	const addToGroupMutation = useMutation({
		mutationFn: ({ studentId, groupId }) => studentService.addToGroup(studentId, groupId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
	});

	// Remove from group
	const removeFromGroupMutation = useMutation({
		mutationFn: ({ studentId, groupId }) =>
			studentService.removeFromGroup(studentId, groupId).then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
		onError: (error) => {
			console.error("Remove from group error:", error);
		},
	});

	// Transfer to another group
	const transferToGroupMutation = useMutation({
		mutationFn: ({ studentId, toGroupId }) =>
			studentService.transferToGroup(studentId, toGroupId).then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
		onError: (error) => {
			console.error("Transfer error:", error);
		},
	});

	return {
		students,
		loading: isLoading,
		error,
		fetchAll,
		fetchById,
		createStudent: createStudentMutation.mutateAsync,
		updateStudent: (id, data) =>
			updateStudentMutation.mutateAsync({ id, data }),
		updateStatus: (id, status) =>
			updateStatusMutation.mutateAsync({ id, status }),
		deleteStudent: deleteStudentMutation.mutateAsync,
		addToGroup: (studentId, groupId) => addToGroupMutation.mutateAsync({ studentId, groupId }),
		removeFromGroup: (studentId, groupId) => removeFromGroupMutation.mutateAsync({ studentId, groupId }),
		transferToGroup: (studentId, toGroupId) => 
			transferToGroupMutation.mutateAsync({ studentId, toGroupId }),
	};
};