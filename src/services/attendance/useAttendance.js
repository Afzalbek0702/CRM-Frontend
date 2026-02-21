import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "./attendanceService.js";

export const useAttendance = ({ group_id, month }) => {
	const queryClient = useQueryClient();

	// 1. Davomat ro'yxatini olish
	const attendanceQuery = useQuery({
		queryKey: ["attendance", group_id, month],
		queryFn: () => attendanceService.getAttendance(group_id, month),
	});

	// 2. Yangi davomat yozuvi qo'shish
	const setAttendance = useMutation({
		mutationFn: (data) => attendanceService.setAttendance(data),
		onSuccess: () => {
			// Keshni yangilash — davomat ro'yxati qayta yuklash
			queryClient.invalidateQueries({
				queryKey: ["attendance", group_id, month],
			});
		},
	});

	return {
		// So'rov natijalari
		attendance: attendanceQuery.data || [],
		isLoading: attendanceQuery.isLoading,
		isError: attendanceQuery.isError,
		error: attendanceQuery.error,

		// Mutatsiya
		setAttendance,

		// Qo'lda qayta yuklash imkoniyati
		refetch: attendanceQuery.refetch,
	};
};
