import { api } from "./client";

export const getServices = async (projectId) => {
  const res = await api.get(`/api/projects/${projectId}/services`);
  return res.data;
};

export const createService = async (projectId, service) => {
  const res = await api.post(`/api/projects/${projectId}/services`, service);
  return res.data;
};
