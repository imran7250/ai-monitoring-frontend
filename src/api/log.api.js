import { api } from "./client";
export const getLogs = (serviceId) => api.get(`/api/services/${serviceId}/logs`).then(r => r.data);
