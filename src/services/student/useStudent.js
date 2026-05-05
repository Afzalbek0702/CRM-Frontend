import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "./studentService.js";

const STUDENTS_QUERY_KEY = ["students"];

export const useStudent = (page,limit) => {
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
		},
		onError: (err) => {
			console.error(err.response?.data);
		},
	});

	// 4. Talabani tahrirlash
	const updateStudentMutation = useMutation({
		mutationFn: ({ id, data }) => studentService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});

	// 5. Talaba statusini yangilash
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }) => studentService.updateStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});

	// 6. Talabani o'chirish
	const deleteStudentMutation = useMutation({
		mutationFn: (id) => studentService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
		},
		onError: (err, id, context) => {
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
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});

	// Remove from group
	const removeFromGroupMutation = useMutation({
		mutationFn: ({ studentId, groupId }) =>
			studentService.removeFromGroup(studentId, groupId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
		},
		onError: (error) => {
			console.error(error.response?.data);
		},
	});

	// Transfer to another group
	const transferToGroupMutation = useMutation({
		mutationFn: ({ studentId, toGroupId }) =>
			studentService.transferToGroup(studentId, toGroupId),
		onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
         queryClient.invalidateQueries({
						queryKey: ["dashboard"],
						refetchType: "none",
					});
         queryClient.invalidateQueries({
						queryKey: ["groups"],
						refetchType: "none",
					});
		},
		onError: (error) => {
			console.error(error.response?.data);
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
		addToGroup: (studentId, groupId) =>
			addToGroupMutation.mutateAsync({ studentId, groupId }),
		removeFromGroup: (studentId, groupId) =>
			removeFromGroupMutation.mutateAsync({ studentId, groupId }),
		transferToGroup: (studentId, toGroupId) =>
			transferToGroupMutation.mutateAsync({ studentId, toGroupId }),
	};
};
