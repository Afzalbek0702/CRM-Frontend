import api from "../api/apiClient";
import { endpoints } from "../api/endpoints";


const withTenant = (path) => {
  const tenant = window.location.pathname.split("/")[1]; // grabs first path segment
  return tenant ? `/${tenant}${path}` : path;
};

export const studentService = {
  getAll: () => api.get(withTenant(endpoints.STUDENTS)).then((r) => r.data),
  
  getById: (id) =>
    api.get(withTenant(`${endpoints.STUDENTS}/${id}`)).then((r) => r.data),
  
  create: (data) =>
    api.post(withTenant(endpoints.STUDENTS), data).then((r) => r.data),
  
  update: (id, data) =>
    api.put(withTenant(`${endpoints.STUDENTS}/${id}`), data).then((r) => r.data),
  
  updateStatus: (id, status) =>
    api
      .patch(withTenant(`${endpoints.STUDENTS}/${id}/status`), { status })
      .then((r) => r.data),
  
  delete: (id) =>
    api.delete(withTenant(`${endpoints.STUDENTS}/${id}`)).then((r) => r.data),
  
  addToGroup: (studentId, groupId) =>
    api
      .post(withTenant(endpoints.ENROLLMENTS), {
        student_id: studentId,
        group_id: groupId,
      })
      .then((r) => r.data),
  
  removeFromGroup: (studentId, groupId) =>
    api
      .post(withTenant(`${endpoints.STUDENTS}/${studentId}/remove-from-group`), {
        groupId,
      })
      .then((r) => r.data),
  
  transferToGroup: (student_id, from_group_id, to_group_id) =>
    api
      .post(
        withTenant(`${endpoints.STUDENTS}/${student_id}/transfer`),
        {
          student_id,
          from_group_id,
          to_group_id,
        }
      )
      .then((r) => r.data),
};