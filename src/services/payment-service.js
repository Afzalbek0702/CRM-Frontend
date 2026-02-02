import api from "./api.js";
import { endpoints } from "./endpoints.js";

export const paymentService = {
   getAll: () => api.get(endpoints.PAYMENTS),
   getById: (id) => api.get(`${endpoints.PAYMENTS}/${id}`),
   update:(id, data) => api.put(`${endpoints.PAYMENTS}/${id}`, data),   
   create: (data) => api.post(endpoints.PAYMENTS, data),
   delete: (id) => api.delete(`${endpoints.PAYMENTS}/${id}`),
}