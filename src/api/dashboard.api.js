import { api } from "./client";

export const getDashboardSummary = async () => {
  const res = await api.get("/api/dashboard/summary");
  return res.data;
};

export const getRecentIncidents = async () => {
  const res = await api.get("/api/dashboard/incidents");
  return res.data;
};

export const getRecentNotifications = async () => {
  const res = await api.get("/api/dashboard/notifications");
  return res.data;
};

export const getAnomalySummary = async () => {
  const res = await api.get("/api/anomalies/summary");
  return res.data;
};