import { useState, useEffect } from "react";
import { api } from "../api/client";
export function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/api/incidents/open")
      .then(res => setIncidents(res.data || []))
      .catch(err => console.error("Failed loading incidents", err))
      .finally(() => setLoading(false));
  }, []);
  return { incidents, loading };
}
