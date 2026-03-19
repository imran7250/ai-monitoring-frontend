import { api } from "./client";
export const getMetrics = (serviceId) => api.get(`/api/metrics/service/${serviceId}`).then(r => r.data);
