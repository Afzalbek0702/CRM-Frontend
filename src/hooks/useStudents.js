import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../services/student-service.js";
import toast from "react-hot-toast";

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
			// Don't show toast here - wait for onSuccess
			await queryClient.cancelQueries({ queryKey: [STUDENTS_QUERY_KEY] });
			const previousStudents = queryClient.getQueryData([STUDENTS_QUERY_KEY]);

			queryClient.setQueryData([STUDENTS_QUERY_KEY], (old) => [
				...(old || []),
				{ ...newStudent, id: Date.now() },
			]);

			return { previousStudents };
		},
		onSuccess: () => {
			toast.success("Talaba muvaffaqiyatli qo'shildi");  // ← Show only on success
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
		onError: (err, newStudent, context) => {
			toast.error("Talaba qo'shishda xatolik yuz berdi");
			queryClient.setQueryData([STUDENTS_QUERY_KEY], context.previousStudents);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
	});

	// 4. Talabani tahrirlash
	const updateStudentMutation = useMutation({
		mutationFn: ({ id, data }) =>
			studentService.update(id, data).then((res) => res.data),
		onSuccess: () => {
			toast.success("Talaba muvaffaqiyatli yangilandi");
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
		onError: (error) => {
			toast.error("Talaba yangilashda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	// 5. Talaba statusini yangilash
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }) =>
			studentService.updateStatus(id, status).then((res) => res.data),
		onSuccess: () => {
			toast.success("Talaba statusi muvaffaqiyatli yangilandi");
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
		onError: (error) => {
			toast.error("Talaba statusini yangilashda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	// 6. Talabani o'chirish
	const deleteStudentMutation = useMutation({
		mutationFn: (id) => studentService.delete(id),
		onMutate: async (id) => {
			toast.success("Talaba muvaffaqiyatli o'chirildi")
			await queryClient.cancelQueries({ queryKey: [STUDENTS_QUERY_KEY] });
			const previousStudents = queryClient.getQueryData([STUDENTS_QUERY_KEY]);

			queryClient.setQueryData([STUDENTS_QUERY_KEY], (old) =>
				(old || []).filter((student) => student.id !== id),
			);

			return { previousStudents };
		},
		onError: (err, id, context) => {
			toast.error("Talaba o'chirishda xatolik yuz berdi")
			console.log(err);
			queryClient.setQueryData([STUDENTS_QUERY_KEY], context.previousStudents);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
	});

	// 7. Talabani guruhga qo'shish
	const addToGroupMutation = useMutation({
		mutationFn: ({ studentId, groupId }) =>
			studentService.addToGroup(studentId, groupId),
		onSuccess: () => {
			toast.success("Talaba guruhga muvaffaqiyatli qo'shildi");
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
		onError: (error) => {
			toast.error("Talaba guruhga qo'shishda xatolik yuz berdi");
			console.log(error.response?.data);
		},
	});

	// Remove from group
	const removeFromGroupMutation = useMutation({
		mutationFn: ({ studentId, groupId }) =>
			studentService.removeFromGroup(studentId, groupId).then((res) => res.data),
		onSuccess: () => {
			toast.success("Talaba guruhdan muvaffaqiyatli olib tashlandi")
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
		onError: (error) => {
			toast.error("Talaba guruhdan olib tashlashda xatolik yuz berdi")
			console.error("Remove from group error:", error);
		},
	});

	// Transfer to another group
	const transferToGroupMutation = useMutation({
		mutationFn: ({ studentId, toGroupId }) =>
			studentService.transferToGroup(studentId, toGroupId).then((res) => res.data),
		onSuccess: () => {
			toast.success("Talaba muvaffaqiyatli boshqa guruhga ko'chirildi")
			queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
		},
		onError: (error) => {
			toast.error("Talabani boshqa guruhga ko'chirishda xatolik yuz berdi")
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