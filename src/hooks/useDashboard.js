import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard-service.js";
import { useGroups } from "./useGroups.js";
import { useStudents } from "./useStudents.js";


export const useDashboard = (from, to, month) => {
	const { groups } = useGroups();
	const { students } = useStudents();

	const monthlyIncomeQuery = useQuery({
		queryKey: ["monthlyIncome", from, to],
		queryFn: () => dashboardService.getMonthlyIncome(from, to).then((res) => res.data),
		enabled: !!from && !!to,
		staleTime: 10 * 60 * 1000, 
		refetchOnWindowFocus: false,
	});

	const topDebtorsQuery = useQuery({
		queryKey: ["topDebtors", month],
		queryFn: () =>
			dashboardService.getTopDebtors(month).then((res) => res.data),
		enabled: !!month,
		staleTime: 10 * 60 * 1000,
		refetchOnWindowFocus: false,
   });
	const todayLessons = useQuery({
		queryKey: ["todayLessons"],
		queryFn: () =>
			dashboardService.getTodayLessons().then((res) => res.data),
		staleTime: 10 * 60 * 1000,
		refetchOnWindowFocus: false,
	});

	// Query for absent students - fetches attendance for all groups
	const absentStudentsQuery = useQuery({
		queryKey: ["absentStudentsToday", groups?.length],
		queryFn: async () => {
			if (!groups || groups.length === 0 || !students || students.length === 0) {
				return [];
			}

			const today = new Date();
			const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
			const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM

			const absentStudents = [];

			// Fetch attendance for each group
			for (const group of groups) {
				try {
					const attendanceData = await dashboardService
						.getAttendance(group.id, currentMonth)
						.then((res) => res.data);

					// Filter for today's absent records
					const todayAbsent = attendanceData.filter(
						(record) =>
							record.lesson_date === todayString &&
							(record.status === "absent" || record.status === "0")
					);

					// Map attendance records to include student and group info
					todayAbsent.forEach((record) => {
						const student = students.find((s) => s.id === record.student_id);
						if (student) {
							absentStudents.push({
								student_id: record.student_id,
								student_name: student.full_name,
								group_id: group.id,
								group_name: group.name,
								phone: student.phone,
								lesson_date: record.lesson_date,
							});
						}
					});
				} catch (error) {
					console.error(`Error fetching attendance for group ${group.id}:`, error);
				}
			}

			return absentStudents;
		},
		enabled: !!groups && groups.length > 0 && !!students && students.length > 0,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});

	return {
		monthlyIncomeQuery,
		topDebtorsQuery,
		todayLessons,
		absentStudentsQuery,
	};
};
