import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard-service.js";


export const useDashboard = (from, to, month) => {
	// 1. Oylik daromadni olish (from, to bilan)
	const monthlyIncomeQuery = useQuery({
		queryKey: ["monthlyIncome", from, to],
		queryFn: () => dashboardService.getMonthlyIncome(from, to).then((res) => res.data),
		enabled: !!from && !!to, // faqat from/to mavjud bo'lsa so'rov ketadi
		staleTime: 10 * 60 * 1000, // 10 daqiqa cache
		refetchOnWindowFocus: false,
	});

	// 2. Eng ko'p qarzdorlarni olish (oy bo'yicha)
	const topDebtorsQuery = useQuery({
		queryKey: ["topDebtors", month],
		queryFn: () =>
			dashboardService.getTopDebtors(month).then((res) => res.data),
		enabled: !!month,
		staleTime: 10 * 60 * 1000,
		refetchOnWindowFocus: false,
   });
   // 3. Bugungi darslar ro'yxatini olish
	const todayLessons = useQuery({
		queryKey: ["todayLessons"],
		queryFn: () =>
			dashboardService.getTodayLessons().then((res) => res.data),
		staleTime: 10 * 60 * 1000,
		refetchOnWindowFocus: false,
	});

	return {
		monthlyIncomeQuery,
		topDebtorsQuery,
		todayLessons,
	};
};
