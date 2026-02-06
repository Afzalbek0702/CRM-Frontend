import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard-service.js";


export const useDashboard = (from, to, month) => {

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
      queryKey: ["absentStudents"],
      queryFn:  () => dashboardService.getAbsentStudents().then((res) => res.data),
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
   });

	return {
		monthlyIncomeQuery,
		topDebtorsQuery,
		todayLessons,
		absentStudentsQuery,
	};
};