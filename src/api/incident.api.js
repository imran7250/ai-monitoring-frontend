import { api } from "./client";

// 🔴 open incidents (dashboard / incidents page)
export const getOpenIncidents = () =>
  api.get("/api/incidents/open").then(res => res.data);

// 📜 history per service
export const getServiceIncidents = (serviceId) =>
  api.get(`/api/incidents/service/${serviceId}`).then(res => res.data);

// ✅ resolve incident
export const resolveIncident = (incidentId) =>
  api.put(`/api/incidents/${incidentId}/resolve`).then(res => res.data);
