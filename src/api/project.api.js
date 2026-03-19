import { api } from "./client";

export const getProjects = async () => {
  const res = await api.get("/api/projects");
  return res.data;
};

export const createProject = async (data) => {
  const res = await api.post("/api/projects", data);
  return res.data;
};

export const deleteProject = async (id) => {
  return await api.delete(`/api/projects/${id}`);
};
