import api from "../api/apiClient.js";
import { endpoints } from "../api/endpoints.js";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1];
  return tenant ? `/${tenant}${path}` : path;
};

export const attendanceService = {
  getAttendance: (group_id, month) =>
    api
      .get(withTenant(endpoints.ATTENDANCE), { params: { group_id, month } })
      .then((r) => r.data),

  setAttendance: (data) =>
    api.post(withTenant(endpoints.ATTENDANCE), data).then((r) => r.data),
};