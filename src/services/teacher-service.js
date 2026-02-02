import api from "./api.js";
import { endpoints } from "./endpoints.js";

export const teacherService = {
   getAll: async () => await api.get(endpoints.TEACHERS, ),
   getById: async (id) => await api.get(`${endpoints.TEACHERS}/${id}`),
   create: async (data) => await api.post(endpoints.TEACHERS, data),
   update: async (id, data) => await api.put(`${endpoints.TEACHERS}/${id}`, data),
   delete: async (id) => await api.delete(`${endpoints.TEACHERS}/${id}`),
};