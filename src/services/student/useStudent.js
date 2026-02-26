import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "./studentService.js";
import toast from "react-hot-toast";

const STUDENTS_QUERY_KEY = ["students"];

export const useStudent = () => {
	const queryClient = useQueryClient();
	// 1. Barcha talabalarni yuklash (avtomatik)
	const {
		data: students = [],
		isLoading,
		error,
		refetch: fetchAll,
	} = useQuery({
		queryKey: STUDENTS_QUERY_KEY,
		queryFn: () => studentService.getAll(),
	});

	const fetchById = async (id) => {
		return await studentService.getById(id);
	};

	const createStudentMutation = useMutation({
		mutationFn: (data) => studentService.create(data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
			toast.success("Talaba muvaffaqiyatli qo'shildi");
		},
		onError: (err) => {
			toast.error("Talaba qo'shishda xatolik yuz berdi");
			console.error(err.response?.data);
		},
	});

	// 4. Talabani tahrirlash
	const updateStudentMutation = useMutation({
		mutationFn: ({ id, data }) => studentService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
			toast.success("Talaba muvaffaqiyatli yangilandi");
		},
		onError: (error) => {
			toast.error("Talaba yangilashda xatolik yuz berdi");
			console.error(error.response?.data);
		},
	});

	// 5. Talaba statusini yangilash
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }) => studentService.updateStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
			toast.success("Talaba statusi muvaffaqiyatli yangilandi");
		},
		onError: (error) => {
			toast.error("Talaba statusini yangilashda xatolik yuz berdi");
			console.error(error.response?.data);
		},
	});

	// 6. Talabani o'chirish
	const deleteStudentMutation = useMutation({
		mutationFn: (id) => studentService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
			toast.success("Talaba muvaffaqiyatli o'chirildi");
		},
		onError: (err, id, context) => {
			toast.error("Talaba o'chirishda xatolik yuz berdi");
			console.error(err.response?.data);
			queryClient.setQueryData(STUDENTS_QUERY_KEY, context.previousStudents);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
		},
	});

	// 7. Talabani guruhga qo'shish
	const addToGroupMutation = useMutation({
		mutationFn: ({ studentId, groupId }) =>
			studentService.addToGroup(studentId, groupId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
			toast.success("Talaba guruhga muvaffaqiyatli qo'shildi");
		},
		onError: (error) => {
			toast.error("Talaba guruhga qo'shishda xatolik yuz berdi");
			console.error(error.response?.data);
		},
	});

	// Remove from group
	const removeFromGroupMutation = useMutation({
		mutationFn: ({ studentId, groupId }) =>
			studentService.removeFromGroup(studentId, groupId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
			toast.success("Talaba guruhdan muvaffaqiyatli olib tashlandi");
		},
		onError: (error) => {
			toast.error("Talaba guruhdan olib tashlashda xatolik yuz berdi");
			console.error(error.response?.data);
		},
	});

	// Transfer to another group
	const transferToGroupMutation = useMutation({
		mutationFn: ({ studentId, toGroupId }) =>
			studentService.transferToGroup(studentId, toGroupId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
			toast.success("Talaba muvaffaqiyatli boshqa guruhga ko'chirildi");
		},
		onError: (error) => {
			toast.error("Talabani boshqa guruhga ko'chirishda xatolik yuz berdi");
			console.error(error.response?.data);
		},
	});

	return {
		students,
		loading: isLoading,
		error,
		fetchAll,
		fetchById,
		createStudent: createStudentMutation.mutate,
		updateStudent: (id, data) =>
			updateStudentMutation.mutate({ id, data }),
		updateStatus: (id, status) =>
			updateStatusMutation.mutate({ id, status }),
		deleteStudent: deleteStudentMutation.mutate,
		addToGroup: (studentId, groupId) =>
			addToGroupMutation.mutate({ studentId, groupId }),
		removeFromGroup: (studentId, groupId) =>
			removeFromGroupMutation.mutate({ studentId, groupId }),
		transferToGroup: (studentId, toGroupId) =>
			transferToGroupMutation.mutate({ studentId, toGroupId }),
	};
};
