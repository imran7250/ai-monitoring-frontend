import { api } from "./client";
export const getNotifications = () => api.get("/api/notifications").then(r => r.data);
