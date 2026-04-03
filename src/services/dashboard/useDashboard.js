import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "./dashboardService.js";
const fromNowDate = new Date().toISOString().slice(0, 7) + "-01";
const toNowDate = new Date().toISOString().slice(0, 7) + "-31";
const monthNowDate = new Date().toISOString().slice(0, 7) + "-01";
export const useDashboard = (
	from = fromNowDate,
	to = toNowDate,
	month = monthNowDate,
) => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => dashboardService.get(from, to, month),
	});
console.log(data?.studentAndGroupData);

   return {
		monthlyIncome: data?.monthlyIncome,
		topDebtors: data?.topDebtors,
		todayLessons: data?.todayLessons,
      absentStudents: data?.absentStudents,
      debtAnalysis:data?.debtAnalysis,
      studentData:data?.studentAndGroupData?.students,
      groupData:data?.studentAndGroupData?.groups,
		error,
		isLoading,
	};
};
