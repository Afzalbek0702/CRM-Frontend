import api from "./api.js";
import { endpoints } from "./endpoints.js";

export const dashboardService = {
	getMonthlyIncome: (from, to) =>
		api.get(endpoints.DASHBOARD + "/monthly-income", { params: { from, to } }),

	getTopDebtors: (month) =>
		api.get(endpoints.DASHBOARD + "/top-debtors", {
			params: { month },
      }),
   getTodayLessons: () => api.get(endpoints.DASHBOARD + "/today-lessons"),
   
   // Fetch attendance records
   getAttendance: (group_id, month) =>
		api.get(endpoints.ATTENDANCE, { params: { group_id, month } }),
};
// from=2025-08-01&to=2026-01-31