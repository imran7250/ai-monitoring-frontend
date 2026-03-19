import { useState, useEffect } from "react";
import { api } from "../api/client";
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/api/projects")
      .then(res => setProjects(res.data || []))
      .catch(err => console.error("Failed loading projects", err))
      .finally(() => setLoading(false));
  }, []);
  return { projects, loading };
}
