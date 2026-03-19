import { api } from "./client";
export const getAlerts = () => api.get("/api/alerts/all").then(r => r.data);
export const enableAlert = (id) => api.put(`/api/alerts/${id}/enable`).then(r => r.data);
export const disableAlert = (id) => api.put(`/api/alerts/${id}/disable`).then(r => r.data);
export const deleteAlert = (id) => api.delete(`/api/alerts/${id}`).then(r => r.data);
